import React from 'react';
import './StoreAdminModalModul.css'


// storeUpdate.js , StoreAdminboardModalUpdatePage.js , StoreAdminModalModul.css 
const StoreAdminModal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header } = props;

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section  style={{width:'500px'}}>
          <header style={{textAlign:'center'}}>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main  style={{height:'690px'}}>{props.children}</main>
        </section>
      ) : null}
    </div>
  );
};
export default StoreAdminModal;