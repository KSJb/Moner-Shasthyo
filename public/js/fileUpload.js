/*************************** PDF Upload *******************************/
console.log('fileUpload.js');
var upbtn = document.getElementById('inputFile');
upbtn.addEventListener('change', function(e){
  pdf_file = e.target.files[0]; 
  console.log("Selected pdf file: "+pdf_file.name);
})

function fileUpload(post_id){
  var storageRef = firebase.storage().ref('MyPdfFolder/' + pdf_file.name);
  var task = storageRef.put(pdf_file);
  console.log("Uploading pdf file: "+pdf_file.name);
  task.on('state_changed', 
    function progress(snapshot){
      var pc = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      var val = Math.round(pc);
      var up_bar = document.getElementById('progress-bar');
      console.log("Progress: "+pc+" - - "+snapshot.bytesTransferred+" ' ' "+snapshot.totalBytes);
      up_bar.value = val;
    },

    function error(){

    },

    function complete(){
      task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('pdf available at - ', downloadURL);
      firebase.database().ref('/Posts/' + post_id).update({
          pdfURL : downloadURL
      }).then(function(){
          console.log("pdf URL logged at : "+post_id);
          location = 'index.html';
      })
          });
  }
  )
}
/*************************** PDF Upload *******************************/
