const multer=require('multer');

//Multer Configuration
const storage= multer.memoryStorage();
const upload=multer({storage:storage});

module.exports=upload;
 