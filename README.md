# Notes and Possible Improvements

- Web accessiblity (lack of time)

## Page 1:

Accessed by [./page1.html](./page1.html) in browser

- Better fetching and loading of data by pagination and lazy loading.
- Group posts by user: Another method I've tried is to use hashmap of user:postId. Will also be able to store sorted postIds.

```javascript
/**
 * Hashmap where keys are user IDs (int)
 * and values are arrays of: post IDs (int)
 * @typedef {Object.<number, [number]>} UserPostMap
 */
const userPostMap = {
  1: [1, 2, 3, 4],
  2: [5, 6, 7, 8],
};
```

## Page 2:

Accessed by [./page2.html](./page2.html) in browser

- Only used most basic 4 interfaces (AudioContext, AudioNode, AudioBuffer, AudioBufferSourceNode). Can try out others like GainNode and OscillatorNode.
- Used `fetch` instead of `XHR`
- Used external .ogg files hosted by archive.org because of CORS. Provided .ogg files can be re-hosted on a server with CORS access (lack of time).
- Ideally will have better separation of business and UI logic.
- Notes:
  - Multiple audio files can be played at the same time. Depending on requirements, may or may not be a functionality that is needed. In this case, will have to stop playing of one source node before starting another.
  - Have to create a new AudioBufferSourceNode for each play action, otherwise expect `DOMException: Failed to execute 'start' on 'AudioBufferSourceNode': cannot call start more than once.`
