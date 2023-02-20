# p5js Sample

This is a very basic p5js sample that integrates with the Cognitive Canvas Live Minting experience. It allows customization of
various parameters of the artwork, and shows all the integration points you must provide to provide a seamless experience
for your users.

When live minting, your code runs in a sandboxed iframe with many capabilities. You can also request a multitude of services
from Cognitive Canvas. Both of these combined provide a safe and flexible way to create amazing live minting experiences.

There are no restrictions on how you implement the user interface or your customization or live minting experience. In fact,
we encourage you to use the full screen capability of the iframe to make a first class experience for your users.

You are passed a flag, <i>isCClive</i>, that tells you if you are running in the live minting enviroment, or if you should
just generate the current artwork iteration.

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

Look in [cc.js](./cc.js) for all the functions you can use to send data and other information back to Cognitive Canvas. All of the functions
are prefixed with 'cc'.
