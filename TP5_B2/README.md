# Protocol explaination

## Protocol

The protocol is a simple protocol that is used to communicate between the client and the server. The protocol is based on an string that is sent to the server. The main goal of the protocol is to be as optimized as possible.
The Format is :

first byte : the length of the initial message
second byte : the type of the message
third byte to the last : date of the message
last byte : the message

```js
//so for exemple for moving up:
406634661005h
```

In data type, there is 3 types of data :
0 for movement
1 for fire
2 for interaction
(some will be added later)

## Conf File

The configuration file can configurate the port entry, the hostname and some game setting like the position of the point at the start of the game.
