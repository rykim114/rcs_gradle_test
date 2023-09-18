"use strict";
// Class definition

var KTDropzoneDemo = function () {
    // Private functions
    var demo1 = function () {
        // set the dropzone container id
        var id = '#kt_dropzone_4';

        // set the preview element template
        var previewNode = $(id + " .dropzone-item");
        previewNode.id = "";
        var previewTemplate = previewNode.parent('.dropzone-items').html();
        previewNode.remove();

        var myDropzone4 = new Dropzone(id, { // Make the whole body a dropzone
        	url: "com/uploadDropzone.do", // 컨트롤러, // Set the url for your upload script location
            parallelUploads: 20,	// 동시파일업로드 수(지정수만큼 여러 파일 한번에 컨트롤러)
            previewTemplate: previewTemplate,
            params: {obj:"", fileReadExt:"", fileSize:"", fileid:"", masterSeq: 0, detailSeq: 0},
            acceptedFiles:".png,.jpg,.jpeg,.gif,.bmp,.doc,.docx,.pdf,.xlsx, .txt", // 파일 가능한 것들 
            maxFiles: 6,    // 업로드 파일 수
            uploadMultiple: true,
            maxFilesize: 30, // Max filesize in MB
            autoQueue: false, // Make sure the files aren't queued until manually added
            previewsContainer: id + " .dropzone-items", // Define the container to display the previews
            clickable: id + " .dropzone-select", // Define the element that should be used as click trigger to select files.
            success : function(file, response){
            	$('#masterSeq').val(response.fileId);
            }
        });

        myDropzone4.on("addedfile", function(file) {
            // Hookup the start button
            file.previewElement.querySelector(id + " .dropzone-start").onclick = function() { myDropzone4.enqueueFile(file); };
            $(document).find( id + ' .dropzone-item').css('display', '');
            $( id + " .dropzone-upload, " + id + " .dropzone-remove-all").css('display', 'inline-block');
        });

        // Update the total progress bar
        myDropzone4.on("totaluploadprogress", function(progress) {
            $(this).find( id + " .progress-bar").css('width', progress + "%");
        });

        myDropzone4.on("sending", function(file) {
            // Show the total progress bar when upload starts
            $( id + " .progress-bar").css('opacity', '1');
            // And disable the start button
            
            
            file.previewElement.querySelector(id + " .dropzone-start").setAttribute("disabled", "disabled");
        });

        // Hide the total progress bar when nothing's uploading anymore
        myDropzone4.on("complete", function(progress) {
            var thisProgressBar = id + " .dz-complete";
            setTimeout(function(){
                $( thisProgressBar + " .progress-bar, " + thisProgressBar + " .progress, " + thisProgressBar + " .dropzone-start").css('opacity', '0');
            }, 300)

        });

        // Setup the buttons for all transfers
        document.querySelector( id + " .dropzone-upload").onclick = function() {
        	
            myDropzone4.enqueueFiles(myDropzone4.getFilesWithStatus(Dropzone.ADDED));
        };

//        myDropzone4.on("queuecomplete", function () {
//        	masterSeq = 0;
//        });
      
        // Setup the button for remove all files
        document.querySelector(id + " .dropzone-remove-all").onclick = function() {
        	var masterSeq = $('#masterSeq').val();
        	
            $( id + " .dropzone-upload, " + id + " .dropzone-remove-all").css('display', 'none');
            $(id + " .dropzone-remove-all").val('Y');
            myDropzone4.removeAllFiles(true);
        };

        // On all files completed upload
        myDropzone4.on("queuecomplete", function(progress){
            $( id + " .dropzone-upload").css('display', 'none');
        });

        // On all files removed
        myDropzone4.on("removedfile", function(file){
      
        	
	        	$.ajax({
	        		url:"com/deleteDropzone.do",
	        		dataType : "json",
	        		data : {"masterSeq" : $('#masterSeq').val(), "detailSeq" : file.dSn, "deleteConfirm" : $('.dropzone-remove-all').val()},
	        		success:function(){
	
	        		},
	        		error:function(){
	        			
	        		}
	        	})
        //	if(file.dSn == "" || file.dSn.equals("") || file.dSn.equals("null")){
        	
        		$( id + " .dropzone-upload, " + id + " .dropzone-remove-all").css('display', 'none');
        	//}
    
        });

        myDropzone4.on("processingmultiple", function (files) {
        	var masterSeq = Number($("#masterSeq").val());
        	var detailSeq = Number($("#detailSeq").val());
        	
			for ( var i = 0, ii = files.length; i < ii; i++ ) {
				$(files[i]).attr("dSn", detailSeq + i + 1);
				
			}

			myDropzone4.options.params.masterSeq = masterSeq;
			myDropzone4.options.params.detailSeq = detailSeq;
			
			$("#detailSeq").val(detailSeq + files.length);
        });

/* 영어 메시지 변경 */
//		myDropzone4.options.dictFileTooBig = '첨부파일 허용 용량을 초과했습니다.({{filesize}}MiB) / {{maxFilesize}}MiB';    
//		myDropzone4.dictCancelUploadConfirmation: "삭제하시는게 맞습니까?";
//	 	myDropzone4.dictInvalidFileType: "업로드 할 수 없는 확장자입니다.";
	
        window.myDropzone4 = myDropzone4;
    }

    return {
        // public functions
        init: function() {
            demo1();
        }
    };
};

KTUtil.ready(function() {
    KTDropzoneDemo().init();

});
