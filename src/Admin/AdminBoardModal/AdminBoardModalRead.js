import React, { useState } from 'react';
import { Button } from '@mui/material';
import AdminBoardRead from './AdminBoardRead';
import AdminModal from './AdminModal';

//  게시글 내용보기 .. AdminBoardRead.js ..   
function AdminBoardModalRead(props){
  const [modalOpen, setModalOpen] = useState(false);

  const [adUpSeq1, setAdUpSeq1] = useState([])

  const openModal = (e) => {
    const seq = e.target.parentNode.id
    console.log(seq)
    setAdUpSeq1(seq)
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
    <Button style={{color:'green'}} onClick={openModal}>게시글<br/>확인</Button>
    <AdminModal open={modalOpen} close={closeModal} header="게시글 내용">
   <AdminBoardRead  props={adUpSeq1}/>
    </AdminModal> 
  </>
  );
};

export default AdminBoardModalRead;