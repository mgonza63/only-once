# Only once message
This is an app that allows users to send a link with a message once the message is revealed, the link won't work anymore.

## Tools Used
- Node.js
- Express
- MongoDB
- EJS
- Railway

## Notes
I found an interesting problem after deploying and testing this project. At first, I had the one time message appear right when the GET request was made having the findByIdAndDelete() was perfect for this since I want the message to be read once and then removed from the database. 
```
app.get("/:id", async (req, res) => {
  try {
  const message = await Message.findByIdAndDelete(req.params.id).exec();
  } catch (error) {
    console.log(error);
  }
});
```
This is the code I had and it worked perfectly, but whenever I sent the link to a friend, the message object would disappear from my database. Then, I realized most message apps make a GET request to add the meta data (title, description, image, etc.). And this is why I had to change the code so that the user has to click a button to reveal the message, making a different request and then I can go ahead and delete it from the database.

## TODO's
- [ ] Loading states
- [X] error handling
- [X] copy to clipboard
- [ ] hashing
- [ ] maybe use other type of uuid to prevent people of guessing a random url string and get a message
