import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import emptySeat from './emptySeat';
import Modal from './PaymentModal.js';
import styles from '../css/Get.module.css';
import axios from 'axios';
import Layout from '../Main/Layout';





const Get = () => {
    const {pk} = useParams();
    const [id] = useState(sessionStorage.getItem('userName'));
    const [movieURL,setMovieURL] = useState('');
    
    //빈배열
    var empty=emptySeat;
    //pk값을 이용해 가져온 상영정보
    const [showDTO,setShowDTO]=useState({});
    //현재 좌석현황
    const [filler,setFiller]=useState([]) 
    //빈배열 + 현재좌석현황
    const [roomStatus,setRoomStatus] = useState([]);
    
    //상영정보 + 현재좌석현황 가져오기.
    useEffect(()=>{
        seatGetter()
    },[])
    const seatGetter =()=>{
        axios.get(`http://localhost:8080/book/getSeat?pk=${pk}`)
        .then(res=>{
            console.log('succeed')
            var copy = res.data;
            setShowDTO(copy)
            setFiller(JSON.parse(copy.movie_seat))
        }).catch(err=>console.log(err))
    }
    useEffect(()=>{
        axios.get(`http://localhost:8080/movielist/getMovieURL?title=${showDTO.movie_title}`)
        .then(res=> setMovieURL(res.data)).catch(err=>console.log(err))
    },[showDTO])

    const getMovieURL=()=>{
      
        
    }
    getMovieURL()

    
    //상영관 예약현황 덮어쓰기
    useEffect(()=>{
        var copyStatus=[]; 
        empty.map((item,index)=>{
            var small=[]
            empty[index].map((item)=>{
                    var exist= false
                    filler.map(fitem=>{
                        exist = item!==null && item.id===fitem.id? true:exist;
                    })
                    small.push(exist? {...item,isReserved:true}:item);
                })
                copyStatus[index]=small
            })
            setRoomStatus(copyStatus)
        },[filler])
        

    const navigate = useNavigate();
     //최대 예약 인원
     const [quantity,setQuantity] = useState(8);
     //현재 선택 좌석
     const [selectedSeat,setSelectedSeat] = useState([]);
     //현재 선택 연령
     const [customerLevel,setCustomerLevel] = useState('adult')
     //총 가격
     const [price,setPrice]=useState(0);
     //할인예정가
     const [discount,setDiscount]=useState(0);
     
     //좌석선택시 입력
     const changeStatus=(id)=>{
         const copyStatus = roomStatus.map((item,index)=>roomStatus[index].map((item)=>{
                 if(item &&item.id==id){
                     if(!item.isReserved){
                         if(!item.customer){
                             if(selectedSeat.length===quantity){
                                 alert('최대 좌석수를 넘어섰습니다.')
                                 return item
                             }else
                                 return {...item, customer:customerLevel}
                         }else{
                             return { id:item.id,number:item.number}
                         }
                     }else{
                         return item
                     }
                 }else{
                     return  item
                 }
             })
         )
         setRoomStatus(copyStatus)
     }
 
     //선택한 좌석을 selectedSeat에 추가
     useEffect(()=>{
         const copyStatus=[]
         roomStatus.map((item,index)=>roomStatus[index].map((item,index)=>{
             if(item&& item.customer){
                 copyStatus.push({
                     id:item.id,
                     number:item.number,
                     customer: item.customer
                 })
             }
         }))
         setSelectedSeat(copyStatus)
     },[roomStatus])
     useEffect(()=>{
         setPrice((selectedSeat.filter(item=>item.customer==='adult').length*10000)+(selectedSeat.filter(item=>item.customer==='child').length*5000))
        
     },[selectedSeat])
 
     //radio버튼 선택시 customer 주입값 변경.
     const customerLevelTarget=(e)=>{
         setCustomerLevel(e.target.id)
     }
 
     //좌석 초기화
     const reset=()=>{
         seatGetter()
     }
     
 
 
     //결제버튼 입력시
     const payment = () => {
         var merchant_seq;
         //마지막 시퀀스값++ 가져와서 merchant_uid로 활용.
         axios.get('/reservation/getSeq')
         .then(res=>{merchant_seq=(res.data+1)}).catch(err=>console.log(err))
 
 
         const { IMP } = window;
         IMP.init('imp16543357')
         // IMP.request_pay(param, callback) 결제창 호출  
 
         IMP.request_pay(
             {
                 // param
                 pg: 'html5_inicis',
                 pay_method: 'card',
                 merchant_uid: merchant_seq,
                 name: 'BitBox 영화예매',
                 amount: (price-discount),
                 buyer_email: 'qkrwlgns0510@naver.com',
                 buyer_name: '박지훈',
                 buyer_tel: '010-1234-5678',
                 buyer_addr: '서울시 강남구',
                 buyer_postcode: '12345',
             },
             res => {
                 if (res.success) {
                     // 결제 성공 시 로직,
                     paymentComplete()
                     
                 } else {
                     // 결제 실패 시 로직,
                     alert('결제에 실패하였습니다.');
                 }
             },
             );
         };
     //결제완료시
     const paymentComplete=()=>{
         //DB에 좌석갱신
         const copy = filler.concat()
         selectedSeat.map(item=>{
             copy.push({id:item.id})
         })
         var addData={...showDTO,movie_seat:JSON.stringify(copy)}
         axios.post('/book/addSeat',addData,{
             headers:{
                 'Content-Type': 'application/json'
             }
         }).then(res=>{
             addReservation();
         }).catch(err=>alert(err))
     }
 
     const addReservation=()=>{
         //예약 테이블 추가
         const copy = [];
         selectedSeat.map(item=>{
             copy.push({
                 id:item.id,
                 number:item.number,
                 customer:item.customer
             })
         })
         const reserveData={...showDTO,selectedSeat:JSON.stringify(copy),book_pk:Number(pk),user_id:id}
         axios.put('/reservation/reservation',reserveData,{
             headers:{
                 'Content-Type': 'application/json'
             }
         }).then(res=> {
            axios.post(`/store/getUser?username=${sessionStorage.getItem("userName")}`)
            .then(res => {
                const {phoneNumber} = res.data
                axios.post('/store/sms', null, {params: {
                    recipientPhoneNumber : phoneNumber,
                    title : '',
                    content : `BITBOX ${showDTO.movie_cinema}\n${showDTO.movie_title} 예매에 성공하였습니다. \n상영일 : ${showDTO.movie_date}\n상영시간 : ${showDTO.movie_time}`
                  }}
                  )
                .then(res =>{
                    alert('예매를 성공했습니다. 마이페이지로 이동합니다.')
                    navigate("/myPage",{replace:true})
                }).catch(error => console.log(error))

            }).catch(error => console.log(error))
        }).catch(err=>console.log(err))
    }
    
    
    
    
    
    //modal 관련 method
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
     };
    const closeModal = () => {
        setModalOpen(false);
    };


    return (
        <>
        <Layout/>
            <div className={styles.title}><h3>예매 좌석 선택</h3></div>
            <div className={styles.seatContainer}>
                <div className={styles.seats}>
                <div className={styles.screen}>s c r e e n</div><br/>
                    
                    {
                        roomStatus.map((item,index)=>(
                            <div key={index} className={styles.part}>
                                {
                                    roomStatus[index].map((item,smallIndex)=>(
                                    <div key={smallIndex} className ={item===null? styles.noSeat:item.isReserved? styles.alreadyReserved:!item.customer?styles.oneSeat:item.customer==='adult'? styles.adultSelected:styles.childSelected} id={item?item.id:''} onClick={(e)=>changeStatus(e.target.id)}> 
                                    {item?item.number:''}<br/>
                                    </div>
                                ))
                            }
                            </div>
                        ))       
                    }
                    <br/>
                    <button className={styles.button} style={{width:'150px'}}onClick={reset} disabled={selectedSeat.length===0? 'disable':''}>초 기 화</button>
                </div>  {/* seats */}
                <div className={styles.reserveTable}>
                    <div className={styles.movie}>
                        <img className={styles.movieImg} src={movieURL}></img>
                        <div className={styles.movieInfo}>
                            <span className={styles.movieInfoFont} style={{marginBottom:'25px',textAlign:'center'}}>
                            <img style={{width:'20px',marginBottom:'5px'}} src={
                                showDTO.movie_age==='All'? '/storage/00.png':
                                showDTO.movie_age==='12'? '/storage/12.png':
                                showDTO.movie_age==='15'? '/storage/15.png':
                                '/storage/18.png'
                            }/> {showDTO.movie_title}
                            </span>
                            <span className={styles.movieInfoFont}>비트박스 {showDTO.movie_cinema} {showDTO.movie_theater}</span>
                            <span className={styles.movieInfoFont}>{showDTO.movie_date}</span>
                            <span className={styles.movieInfoFont}>{showDTO.movie_time}</span>
                        </div>
                        
                    </div>

                    <div className={styles.selectTable}>
                        <span style={{color:'red',fontSize:'0.8em'}}>예약은 최대 8명까지 가능합니다.</span>
                        {/* 인원선택 */}
                        <span>
                            <label id='adult'>
                            <input type='radio' name="customerLevel" id='adult' defaultChecked onChange={(e)=>customerLevelTarget(e)}></input>
                            <span style={{fontSize:'0.9em'}}>일반 : 10000원</span>
                            <span style={{color:'gray',fontSize:'0.8em'}}> 현재 {selectedSeat.filter(item=>item.customer==='adult').length}명</span>
                            </label>
                        </span>
                        <span>
                            <label id='child'>
                            <input type='radio' name="customerLevel" id='child' onChange={(e)=>customerLevelTarget(e)}></input>
                            <span style={{fontSize:'0.9em'}}>청소년 : 5000원</span>
                            <span style={{color:'gray',fontSize:'0.8em'}}> 현재 {selectedSeat.filter(item=>item.customer==='child').length}명</span>
                            </label>
                        </span>
                        <span style={{display:'flex',justifyContent:'space-around', width:'40%', fontSize:'0.7em', marginTop:'10px'}}>
                            <span><div style={{display:'inline-block',width:'15px',height:'15px',backgroundColor:'chocolate',border:'1px solid black',borderRadius:'5px'}}></div>일반</span>
                            <span><div style={{display:'inline-block',width:'15px',height:'15px',backgroundColor:'coral',border:'1px solid black',borderRadius:'5px'}}></div>청소년</span>
                        </span>
                    </div> {/* selectTable */}
                    {/* <span style={{fontSize:'0.8em', margin:'3px',fontWeight:'bold'}}>선택 좌석</span> */}
                    <div className={styles.selectedSeatDisplay}>
                        {
                            selectedSeat.length===0?
                            <span style={{fontSize:'1.3em', color:'green',fontWeight:'bold'}}>좌석을 선택해주세요!    </span>
                            :
                            selectedSeat.map((item,index) => (
                                <div key={index} className={item.customer==='adult'? styles.adultSelected:styles.childSelected} id={item.id} onClick={(e)=>changeStatus(e.target.id)}>
                                {item.number}
                            </div>
                            ))
                        
                        }
                    </div>{/* selectedSeatDisplay */}
                    <div className={styles.selectComplete}>
                        <div className={styles.amount} style={selectedSeat.length===0? {visibility:'hidden'}:{visibility:'visible'}}>금액 : {price}원</div>
                        <div className={styles.buttons}>
                            <button className={styles.button} onClick={()=>navigate(`/user/calendar/${showDTO.movie_title}`)}>이전으로</button>

                            <button className={styles.button} onClick={openModal} disabled={selectedSeat.length===0? 'disable':''}>좌석 선택 완료</button>
                            {/* 주석처리 해주세요 */}
                            {/* <button onClick={paymentComplete}>결제 건너뛰기</button> */}
                        </div>
                    </div>
                </div>
            </div> {/* container*/}
            <div className={styles.footer}></div>
            <Modal 
                open={modalOpen} close={closeModal} header="영화 예매 결제" closeBtn="좌석 다시 선택"
                showDTO={showDTO} selectedSeat={selectedSeat} payment={payment} 
                price={price} discount={discount} movieURL={movieURL}>
            </Modal>
        </>
    );
};

export default Get;