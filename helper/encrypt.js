const crypto=require('crypto')

module.exports=(password)=>{
    return crypto.createHmac('sha256','inisecret').update(password).digest('hex')
    // {"encryptan":"7fc1a3307adb18ccac5b052acb294922a4bfc50947108b828e6e565467facf6b","panjangencrypt":64}
    
}