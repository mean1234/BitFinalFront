import React from 'react';
import QRcode from 'react-qr-code';


const Modal = (props) => {
    // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const {open, close, header, closeBtn, viewReservation, reservationCancel} = props;

    return (
        // 모달이 열릴때 openModal 클래스가 생성된다.
        <div className={open ? 'openModal modal' : 'modal'}>
            {open ? (

                <section style={{width:"300px", height:"750px"}}>
                    <div style={{width: "300px", height: "50px", display: "flex", justifyContent: "center"}}>
                        <header style={{
                            width: "280px",
                            margin: "auto",
                            display: "flex",
                            justifyContent: "center",
                            gap: "150px"
                        }}>
                            <div style={{}}>
                                <img style={{width: "100px"}} alt="mainLogoBlack"
                                     src="../img_member/mainLogoBlack.png"/>
                            </div>
                            <button className="close" onClick={close}>
                                &times;
                            </button>
                        </header>
                    </div>
                    <main className="movieReservationModalMain" style={{height:"650px",  backgroundImage:"url(../img_member/backgroundRev2.png)", backgroundPosition:"top center"}}>
                        <div style={{textAlign:"center", fontWeight:"400", fontSize:"23px", marginBottom:"15px"}}>
                            ★ 영화입장권 ★
                        </div>
                        <p style={{marginBottom:"0", fontSize:"14px"}}>{viewReservation.movie_date}</p>
                        <div>
                            ==================================
                        </div>
                        <p style={{fontSize:"25px", marginBottom:"0"}}>{viewReservation.movie_title}</p>
                        <p style={{marginBottom:"0"}}>{viewReservation.movie_date} {viewReservation.movie_time}</p>
                        <p style={{marginBottom:"0"}}>{viewReservation.movie_cinema} {viewReservation.movie_theater}&nbsp;&nbsp;
                            {
                                viewReservation.movie_seat.map((item1, index) => (
                                    <span
                                        key={item1.id}>{item1.number}{index === viewReservation.movie_seat.length - 1 ? '' : ','}</span>
                                ))
                            }</p>
                        <p style={{marginBottom:"0"}}>{viewReservation.movie_seat.filter(item => item.customer === 'adult').length === 0 ? '' : `성인: ${viewReservation.movie_seat.filter(item => item.customer === 'adult').length}`}명&nbsp;&nbsp;
                            {viewReservation.movie_seat.filter(item => item.customer === 'child').length === 0 ? '' : `청소년: ${viewReservation.movie_seat.filter(item => item.customer === 'child').length}`}
                            명&nbsp;&nbsp;
                        </p>
                        <div style={{marginBottom:"15px"}}>
                            ==================================
                        </div>
                        <div style={{textAlign:"center"}}>
                            <QRcode
                                size={256}
                                style={{height: "150px", width: "150px"}}
                                value={JSON.stringify(viewReservation)}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <div style={{marginTop:"15px"}}>
                            ==================================
                        </div>
                        <div style={{fontSize:"12px"}}>
                            - 교환 및 환불은 상영시간 20분전까지만 가능 하며, 발권된 티켓은 현장방문 시에만 취소가 가능합니다.<br/>
                            - LIVE 공연콘텐츠는 당일 취소가 불가능합니다.<br/>
                            - 초대권은 교환, 환불이 불가능합니다.<br/>
                            - 본 입장권은 소득세법 시행규칙에 의거 지출<br/>
                            증빙 서류로 인정되는 영수증 입니다.
                            - 영화발전기금 3%가 포함된 금액 입니다.<br/>
                            - 지연입장에 의한 관람불편을 최소화하고자 본 영화는 약 10분 후 시작됩니다.<br/>
                            쾌적한 관람 환경을 위해 상영시간 이전에 입장 부탁드립니다.
                        </div>
                    </main>
                        <div style={{marginTop:"15px"}}>
                            <div style={{display:"flex", justifyContent:"center", gap:"50px"}}>
                                <button className="close" onClick={() =>
                                {
                                    if(window.confirm("예매를 취소하시겠습니까? 상영시작 전 20분 이내에는 환불이 불가합니다.")){
                                    reservationCancel(viewReservation)
                                }
                                }}>예매취소
                                </button>
                                <button className="close" onClick={close}>
                                    {closeBtn}
                                </button>
                            </div>
                        </div>
                </section>
            ) : null}
        </div>
    );
};
export default Modal;