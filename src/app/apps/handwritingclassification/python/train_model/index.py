from __future__ import print_function
import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras import backend as K
import json
import numpy as np

import cv2

batch_size = 128
num_classes = 10
epochs = 12

# input image dimensions
img_rows, img_cols = 28, 28

# the data, split between train and test sets
(x_train, y_train), (x_test, y_test) = mnist.load_data()

def rotateImage(image, angle):
  image_center = tuple(np.array(image.shape[1::-1]) / 2)
  rot_mat = cv2.getRotationMatrix2D(image_center, angle, 1.0)
  result = cv2.warpAffine(image, rot_mat, image.shape[1::-1], flags=cv2.INTER_LINEAR)
  return result

train_size = len(y_train)
test_size = len(y_test)

new_x_train = []
new_y_train = []
new_x_test = []
new_y_test = []

print("start rotate x train")
for i in range(train_size):
    for j in range(36):
        new_x_train.append(rotateImage(x_train[i], (j+1)*36))
        new_y_train.append(y_train[i])

print("finish rotate x train")

print("start rotate x test")
for i in range(test_size):
    for j in range(36):
        new_x_test.append(rotateImage(x_test[i], (j+1)*36))
        new_y_test.append(y_test[i])

print("finish rotate x test")

x_train = list(new_x_train)
x_test  = list(new_x_test)
y_train = np.array(new_y_train)
y_test  = np.array(new_y_test)
 

def cut_top_bot(arr):
    arr = np.array(arr)
    result = []
    for i in range(28):
        if(np.count_nonzero(arr[i])):
            result.append(arr[i])
    # return np.array(result)
    return result


def cut_left_right(arr):
    result = []
    cut_left = 0
    cut_right = 0
    width = len(arr[0])
    arr = np.array(arr)
    i = width - 1
    while(i):
        if(np.count_nonzero(arr[:, i]) == 0):
            cut_right += 1
            i -= 1
        else:
            break
    i = 1
    while(i):
        if(np.count_nonzero(arr[:, i-1]) == 0):
            cut_left += 1
            i += 1
        else:
            break

    return arr[:, cut_left: width - cut_right]

print("start crop x train")
t1 = len(x_train)
for i in range(t1):
    x_train[i] = cut_top_bot(x_train[i])
    x_train[i] = cut_left_right(x_train[i])
    x_train[i] = cv2.resize(x_train[i], (28, 28), interpolation=cv2.INTER_AREA)

print("finish x train")

t2 = len(x_test)
for i in range(t2):
    x_test[i] = cut_top_bot(x_test[i])
    x_test[i] = cut_left_right(x_test[i])
    x_test[i] = cv2.resize(x_test[i], (28, 28), interpolation=cv2.INTER_AREA)

print("finish x test")

x_train = np.array(x_train)
x_test = np.array(x_test)

if K.image_data_format() == 'channels_first':
    x_train = x_train.reshape(x_train.shape[0], 1, img_rows, img_cols)
    x_test = x_test.reshape(x_test.shape[0], 1, img_rows, img_cols)
    input_shape = (1, img_rows, img_cols)
else:
    x_train = x_train.reshape(x_train.shape[0], img_rows, img_cols, 1)
    x_test = x_test.reshape(x_test.shape[0], img_rows, img_cols, 1)
    input_shape = (img_rows, img_cols, 1)

x_train = x_train.astype('float32')
x_test = x_test.astype('float32')
x_train /= 255
x_test /= 255

# convert class vectors to binary class matrices
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)

model = Sequential()
model.add(Conv2D(32, kernel_size=(3, 3),
                 activation='relu',
                 input_shape=input_shape))

model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(128, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dense(128, activation='relu'))

model.add(Dropout(0.5))
model.add(Dense(num_classes, activation='softmax'))

model.compile(loss=keras.losses.categorical_crossentropy,
              optimizer=keras.optimizers.Adadelta(),
              metrics=['accuracy'])


model.fit(x_train, y_train,
          batch_size=batch_size,
          epochs=epochs,
          verbose=1,
          validation_data=(x_test, y_test))
score = model.evaluate(x_test, y_test, verbose=0)

print('Test loss:', score[0])
print('Test accuracy:', score[1])

model.save("new_model.h5", include_optimizer=True)
