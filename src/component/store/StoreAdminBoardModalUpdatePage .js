import React, { useState } from 'react';
import StoreAdminModal from './StoreAdminModal';
import StoreUpdate from './StoreUpdate';


// 관리자 store 상품 수정 modal ... StoreUpdate.js 
function StoreAdminBoardModalUpdatePage(props){
  const [modalOpen, setModalOpen] = useState(false);

  const [adSt, setAdSt] = useState([])

  const openModal = (e) => {
  
    // 관리자 store seq 찾기
    const seq = e.target.parentNode.id
    console.log(seq)
    setAdSt(seq)
    setModalOpen(true);
  };

  // modal 취소
  const closeModal = () => {
    setModalOpen(false);
  };


  return (
    <>
    <button style={{ all:'unset',color:'blue',fontSize:12}} onClick={openModal}>수정</button>
    <StoreAdminModal open={modalOpen} close={closeModal} header="상품 수정">
  
  {/* props 이용하여 전달 */}
   <StoreUpdate props={adSt}/>
    </StoreAdminModal > 
  </>
  );
};

export default StoreAdminBoardModalUpdatePage;