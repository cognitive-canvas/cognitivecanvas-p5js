# p5js Sample

This is a very basic p5js sample that integrates with the Cognitive Canvas Live Minting experience. It allows customization of
various parameters of the artwork, and shows all the integration points you must provide to provide a seamless experience
for your users.

## Message Event Listener

The message event listener is how Cognitive Canvas communicates with your code.

```javascript
window.addEventListener("message", (e) => {
  if (!e.data) return;
  switch (e.data.type) {
    case "save_thumbnail":
      saveThumbnail();
      break;
    case "confirm_update":
      // This is typically what you would do on confirm_update
      saveParams();
      saveAttributes();
      ccConfirmUpdate();
      break;
    case "restore":
      console.log("restoring iframe", e.data.restore);
      if (e.data.restore) {
        // restore live mint
      }
      break;
    default:
      break;
  }
});
```

## Sending Data and Information to Cognitive Canvas

Look in [cc.js](./cc.js) for all the functions you can use to send data and other information back to Cognitive Canvas.
