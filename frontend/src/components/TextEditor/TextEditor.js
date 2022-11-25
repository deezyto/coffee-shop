import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Service from '../../service/service';

export default function TextEditor(props) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
    //this.props.itemsFetching();
    new Service().adminCreateItem('/create/item', { title: "some item", slug: "10002jsiq", html: editorRef.current.getContent() }, { "Authorization": `Bearer ${props.authToken}` })
      .then(res => {
        console.log(res)
        //this.props.itemsFetched(res);
      })
      .catch(res => {
        console.log(res)
        //this.props.itemsFetchingErr();
      });
  };
  const initialHtml = () => {
    //new Service().adminGetItems
  }
  return (
    <>
      <Editor
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={`<p>This is the initial content of the editor.</p>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZMv3J8Wszjps4UhHadLTKA-tdSBKOe0HvGDnHv0rfwgIzMLe9y9MXbALVXKiXFkG33yw&usqp=CAU"/>`}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor image | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <button onClick={log}>Log editor content</button>
    </>
  );
}