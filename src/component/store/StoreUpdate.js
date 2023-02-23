import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../css/writeForm.module.css';


 const StoreUpdate = (props) => {
  const [file, setFile] = useState('')

  const online = [
    { value: "combo", label: "콤보" },
    { value: "popcorn", label: "팝콘" },
    { value: "drink", label: "음료" },
    { value: "snack", label: "스낵" },
   ] //원래는 select 태그 안에 들어가는 애들을 배열로 만들어준다.
   
   const [selectOnline, setSelectOnline] = useState(online[0]);
   //안에 들어가는 값을 받아야해서 state사용

  const [form, setForm] = useState({
    category: '',
    subject: '',
    subSubject: '',
    simpleContent: '',
    content: '',
    price: '',
    country: '',
    img: ''
  })

  //비구조할당
  const {  store_seq,category, subject, subSubject, simpleContent, content, price, country, img } = form 

  const [subjectDiv, setSubjectDiv] = useState('')
  const [contentDiv, setContentDiv] = useState('')
  const [priceDiv, setPriceDiv] = useState('')
  const [countryDiv, setCountryDiv] = useState('')


  //관리자 store 상품 수정 전 가져오기
  useEffect (()=> {
    axios.get(`http://localhost:8080/store/getAdminStoreList?store_seq=${props.props}`)
          .then(res => {
            setForm({
              store_seq :res.data.store_seq,
              category: res.data.category,
              subject: res.data.subject,
              subSubject: res.data.subSubject,
              simpleContent: res.data.simpleContent,
              content: res.data.content,
              price: res.data.price,
              country: res.data.country
            })
          })
          .catch(error => console.log(error))
  },[])
  

  const onInput = (e) => {
    const { name, value } = e.target
    console.log(e.target.value)

    setForm({
      ...form,
      [name]: value
    })
  }

  const navigate = useNavigate()

  // 관리자 store 이미지  
  const readURL = (input) => {
    var reader = new FileReader();
    reader.readAsDataURL(input.files[0]);

    reader.onload = () => {
      console.log(input.files[0])
      setForm({
        ...form,
        img: input.files[0].name
      })
      setFile(input.files[0])
    }
  }

  // 관리자 store 수정
  const onUpdateSubmit = (e) => {
    e.preventDefault()

    setSubjectDiv('')
    setContentDiv('')
    setPriceDiv('')
    setCountryDiv('')

    // const sw = 1
    // 관리자 store 수정 유효성 검사
    let sw = 1
    if(!subject) {
      setSubjectDiv('제목을 작성하세요!')
      sw = 0
    }
    if(!content) {
      setContentDiv('내용을 작성하세요!')
      sw = 0
    }
    if(!price) {
      setPriceDiv('가격을 입력하세요!')
      sw = 0
    }
    if(!country) {
      setCountryDiv('원산지를 입력하세요!')
      sw = 0
    }

    // 관리자 store 이미지 업로드
    if(sw === 1) {
        var formData = new FormData()
        
        formData.append('img', file)
        console.log(formData)
    
        axios.post('http://localhost:8080/store/imgUpload', formData, {
          headers : {
            'content-Type' : `multipart/form-data`
          }
        })
            .then()
            .catch(error => console.log(error))

        //관리자 stroe 상품 수정
        axios.put('http://localhost:8080/store/storeUpdate', null, { params: form })
             .then(() => {
                alert('스토어에 품목이 수정되었어요!');
                navigate('/store/');
            })
             .catch(error => console.log(error))
    }
  }

  // 관리자 store 중복검사 
  const isExistSubject = () => {
    axios.get(`http://localhost:8080/store/isExistSubject?subject=${subject}`)
         .then(res => {
            setSubjectDiv(res.data === 'non_exist' ? '등록 가능' : '등록 불가능')
         })
         .catch(error => console.log(error))
  }

  // 취소
  const onClose = () => {
    window.location.reload();
  }

  const [selected, setSelected] = React.useState("");

  return (
    
    <div className='ststststs' value={store_seq}>
       <br/>
      <h3 style={{textAlign:'center'}}>
        <Link to='/store'>
          <img src='../img_member/mainLogo_bit.png' width="70" height="70" style={{ cursor: 'pointer',display:'inline'}} />
        </Link>
        &nbsp;&nbsp;
            <span className='stostosto' style={{textAlign:'right',verticalAlign:'middle'}}>스토어 제품 수정</span>
      </h3>
      <form className={ styles.writeForm } style={{maxWidth:800, textAlign:'center'}} value={store_seq} >

        <select onChange={ onInput } name="category" style={{maxWidth:600, textAlign:'center'}} id={category} value={category}>
          <option>----- 카테고리를 선택해주세요 -----</option>
          <option value="combo">콤보</option>
          <option value="popcorn">팝콘</option>
          <option value="drink">음료</option>
          <option value="snack">스낵</option>
        </select> 

        <table id="adSt">
          <thead>
          <br/><br/>
            <tr>
              <td width="140px" align="center" style={{fontSize:15,fontWeight:'bolder'}}>Product Subject</td>
              <td>
                <input type="text" name="subject" id={subject} value={ subject } onChange={ onInput } onBlur={ isExistSubject } style={{width:250,background:'transparent',borderTop:'none',borderLeft:'none',borderRight:'none' ,borderBottomWidth:1}} placeholder='상품 제목'/>
                <div id="subjectDiv">{ subjectDiv }</div>
              </td>
            </tr>
            <br/>

            <tr>
              <td width="140px" align="center" style={{fontSize:15,fontWeight:'bolder'}}>Product Subject(2)</td>
              <td>
                <input type="text" name="subSubject" id={subSubject} value={ subSubject } onChange={ onInput } style={{width:250,background:'transparent',borderTop:'none',borderLeft:'none',borderRight:'none' ,borderBottomWidth:1}}
                placeholder='상품 소제목' />
              </td>
            </tr>
            <br/>
          </thead>
          
          <tbody>
            <tr>
              <td width="140px" align="center" style={{fontSize:15,fontWeight:'bolder'}}>Brief Content</td>
              <td>
                <input type="text" name="simpleContent" id={simpleContent} value={ simpleContent } onChange={ onInput } style={{width:250,background:'transparent',borderTop:'none',borderLeft:'none',borderRight:'none' ,borderBottomWidth:1}} 
                placeholder='간략한 내용'/>
              </td>
            </tr>
            <br/>

            <tr>
              <td width="140px" align="center" style={{fontSize:15,fontWeight:'bolder'}}> Detailed Content</td>
              <td>
                <textarea name="content" id={content} value={ content } placeholder="상품 내용을 입력하세요" onChange={ onInput } style={{width:250,height:100}} />
                <div id="contentDiv">{ contentDiv }</div>
              </td>
            </tr>
            <br/>

            <tr>
              <td width="140px" align="center" style={{fontSize:15,fontWeight:'bolder'}}>Price</td>
              <td>
                <input type="text" name="price" id={price} value={ price } onChange={ onInput } style={{width:250,background:'transparent',borderTop:'none',borderLeft:'none',borderRight:'none' ,borderBottomWidth:1}}
                placeholder='상품 가격'/>
                <div id="priceDiv">{ priceDiv }</div>
              </td>
            </tr>
            <br/>

            <tr>
              <td width="140px" align="center" style={{fontSize:15,fontWeight:'bolder'}}>Made in</td>
              <td>
                <input type="text" name="country" id={country} value={ country } onChange={ onInput } style={{width:250,background:'transparent',borderTop:'none',borderLeft:'none',borderRight:'none' ,borderBottomWidth:1}}
                placeholder='원산지' />
                <div id="countryDiv">{ countryDiv }</div>
              </td>
            </tr>
            <br/>
            <br/>

            <tr>
              <td width="140px" align="center" style={{fontSize:15,fontWeight:'bolder'}}>Imge</td>
              <td>
                <input type="file" name='img'  onChange={e => readURL(e.target)}/>
              </td>
            </tr>
            <br/>
            <br/>
            <tr>
              <td colSpan='2' align='center'>
                <button  style={{all:'unset',color:'blue',cursor:'pointer'}} onClick={ onUpdateSubmit }>상품 수정</button>
               &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                <button style={{all:'unset',color:'red',cursor:'pointer'}} onClick={ onClose }>취소</button>
              </td>
            </tr>
            <br/><br/>
          </tbody>
        </table>		
      </form>
    </div>
  );
};

export default StoreUpdate;