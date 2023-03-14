import React, {useEffect, useState} from 'react';
import joinForm from './JoinForm.module.css';
import axios from "axios";
import {useNavigate} from "react-router-dom";


const InfoMember = ({setNum}) => {

    const navi = useNavigate();

    //상단 페이지 구분바
    useEffect(() => {
        setNum(3)
    }, []);


    //체크박스
    const write = (e) => {
        e.preventDefault()
    }

    const [marketing_agree, setMarketing_agree] = useState('미동의')
    const [isAllChecked, setIsAllChecked] = useState(false)

    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)

    const allChecked = (e) => {
        const state = e.target.value
        console.log(state)

        if (state === '동의') {
            setMarketing_agree('동의')
            setOpen1(true)
            setOpen2(true)
            setOpen3(true)
        }

        if (state === '미동의') {
            setMarketing_agree('미동의')
            setOpen1(false)
            setOpen2(false)
            setOpen3(false)
        }


    }

    const onOpen = (e) => {
        if (e.target.id === 'push') setOpen1(!open1)
        if (e.target.id === 'sms') setOpen2(!open2)
        if (e.target.id === 'email') setOpen3(!open3)

        console.log(e.target.id)

    }
    useEffect(() => {

        if (open1 === true) {
            setIsAllChecked(true)
            console.log("open1")
        }
        if (open2 === true) {
            setIsAllChecked(true)
            console.log("open2")

        }
        if (open3 === true) {
            setIsAllChecked(true)
            console.log("open3")

        }

        open1 && open2 && open3 && setIsAllChecked(true)
        !open1 && !open2 && !open3 && setIsAllChecked(false)
    }, [open1, open2, open3])

    // 회원가입 세팅
    const [form, setForm] = useState({
        name: '',
        birth: '',
        phoneNumber: '',
        username: '',
        password: '',
        email: ''
    });

    // input 값 setForm
    const inputValue = (e) => {

        const {name, value} = e.target
        setForm({
            ...form,
            [name]: value
        });

    }

    const {name, username, password, birth, email, phoneNumber, pwdChkVal} = form;


    // username 중복체크
    const checkId = () => {
        setIdDiv('');
        axios.get(`http://localhost:8080/member/duplicationChk?username=${username}`)
            .then(res => {
                setIdDiv(res.data === 'duplicate' ? '중복된 아이디입니다!' : '')
            })
            .catch(error => console.log(error));
    }


    // 유효성 검사 후 회원가입 버튼 활성화
    const [disable, setDisable] = useState(false);
    // 이름 값 체크
    const [inputNameChk, setInputNameChk] = useState("");
    // 생년월일 체크
    const [inputBirthChk, setInputBirthChk] = useState("");
    // 핸드폰번호 체크
    const [inputPhoneChk, setInputPhoneChk] = useState("");
    // 비밀번호 체크
    const [inputPwdChk, setInputPwdChk] = useState("");
    // 비밀번호 확인 체크
    const [inputRePwdChk, setInputRePwdChk] = useState("");
    // 이메일 체크
    const [inputEmailChk, setInputEmailChk] = useState("");


    // 이메일 형식 체크
    // eslint-disable-next-line
    const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;



    const [idDiv, setIdDiv] = useState('')
    const [pwdDiv, setPwdDiv] = useState('')
    const [certifOk, setCertifOk] = useState(1);


    //아이디 유효성 검사
    const onInputId = (e) => {
        const currentId = e.target.value;
        const idRegExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;

        if (idRegExp.test(currentId)) {
            setIdDiv("");
        } else {
            setIdDiv("아이디는 영문,숫자 조합 8자리 이상 12자리 이하 입니다.");
        }

    }


    // 본인인증 버튼 활성화 비활성화
    const [certifBtn, setCertifBtn] = useState(true);


    // 본인인증
    const onClickCertificate = () => {

        const {IMP} = window;
        IMP.init('imp10391932');

        const data = {
            merchant_uid: `mid_${new Date().getTime()}`,
            company: 'bitBox',
            carrier: '',
            name: name,
            phone: phoneNumber
        };

        IMP.certification(data, callback);
    }

    const callback = (response) => {
        const {
            success,
            merchantUid,
            errorMsg,
        } = response;

        if (success) {
            axios.get(`http://localhost:3000/member/existName?phoneNumber=${phoneNumber}`)
                .then(res => {
                    if (res.data === 'exist') {
                        alert("회원가입이 완료되어 있는 인증정보입니다");
                        setCertifOk(1);
                    } else {
                        alert('인증이 완료되었습니다.');
                        setCertifOk(0);
                        setCertifBtn(true)
                    }
                })
                .catch(error => console.log(error));

        } else {
            alert(`fail : ${errorMsg}`);
            setCertifOk(1);
        }
    }

    const signUpActionHandler = () => {
        axios.post('http://localhost:8080/auth/signup', null, {params: form})
            .then(res => {
                alert('계정이 등록되었습니다. 감사합니다.');
                navi("/member/joinForm/finishJoin");
            })
            .catch(error => console.log(error));
    }

    return (
        <>
            <div className={joinForm.page_info_txt}>
                <span>회원정보를 입력해주세요.</span>
            </div>
            <div className={joinForm.table_wrap}>
                <table className={`${joinForm.board_form} ${joinForm.write}`}>
                    <caption>
                        생년월일, 휴대폰번호, 아이디, 비밀번호, 비밀번호 확인, 이메일 주소,
                        무인발권기 기능설정, 나만의 메가박스 항목을 가진 회원가입 정보입력 표
                    </caption>
                    <colgroup>
                        <col style={{width: 130}}/>
                        <col/>
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="row">이름*</th>
                        <td id="ibxMbJoinInfoRegBirthDe">
                            <input
                                autoFocus={true}
                                maxLength={16}
                                id="name"
                                name="name"
                                type="text"
                                placeholder="본인인증 버튼 클릭 시 자동입력"
                                className={`${joinForm.input_text} ${joinForm.w260px}`} //" w260px"
                                value={name}
                                onChange={inputValue}
                                onBlur={(e) => {
                                    if (!e.target.value) {
                                        setInputNameChk("필수 입력정보입니다.");
                                    } else {
                                        setInputNameChk("");
                                    }
                                }}
                            />
                            <div style={{width: "auto"}}>
                                <div id="nameDiv" style={{
                                    marginLeft: "73px",
                                    color: "#B20710",
                                    fontSize: "10pt",
                                    textAlign: "left"
                                }}>{inputNameChk}</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">생년월일*{/*생년월일*/}</th>
                        <td id="ibxMbJoinInfoRegBirthDe">
                            <input
                                maxLength={6}
                                id="birth"
                                name="birth"
                                type="number"
                                placeholder="생년월일 6자리"
                                className={`${joinForm.input_text} ${joinForm.w260px}`} //" w260px"
                                value={birth}
                                onChange={inputValue}
                                onBlur={(e) => {
                                    if (!e.target.value) {
                                        setInputBirthChk("필수 입력정보입니다.");
                                    } else if (e.target.value.length !== 6) {
                                        setInputBirthChk("6자리를 입력해주세요!");
                                    } else {
                                        setInputBirthChk("");
                                    }
                                }}
                            />
                            <div style={{width: "auto"}}>
                                <div id="nameDiv" style={{
                                    marginLeft: "73px",
                                    color: "#B20710",
                                    fontSize: "10pt",
                                    textAlign: "left"
                                }}>{inputBirthChk}</div>
                            </div>
                        </td>
                    </tr>
                    {/* 휴대폰 번호 불러올때 */}
                    <tr id="trMblpTelno" >
                        <th scope="row">휴대폰 번호* {/*휴대폰 번호 */}</th>
                        <td>
                            <input
                                maxLength={11}
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                placeholder="' - ' 없이 입력해주세요"
                                className={`${joinForm.input_text} ${joinForm.w260px}`} //" w260px"
                                value={phoneNumber}
                                onChange={inputValue}
                                onBlur={(e) => {
                                    if (!e.target.value) {
                                        setInputPhoneChk("필수 입력정보입니다.");
                                        setCertifBtn(true);
                                    } else if (e.target.value.length !== 11) {
                                        setInputPhoneChk("11자리를 입력해 주세요");
                                        setCertifBtn(true);
                                    } else {
                                        setInputPhoneChk("");
                                        setCertifBtn(false);
                                    }
                                }}
                            />
                            &nbsp; &nbsp;
                            <button
                                id="btnMbLoginIdDupCnfm"
                                type="button"
                                className={`${joinForm.button} ${joinForm.gray_line} ${joinForm.small} ${joinForm.w75px} ${joinForm.ml08} ${joinForm.disabled}`}
                                onClick={onClickCertificate}
                                disabled={certifBtn}
                            >
                                본인인증
                            </button>
                            <div style={{width: "auto"}}>
                                <div id="nameDiv" style={{
                                    marginLeft: "70px",
                                    color: "#B20710",
                                    fontSize: "10pt",
                                    textAlign: "left"
                                }}>{inputPhoneChk}</div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label htmlFor="ibxJoinInfoRegLoginId">아이디*{/*아이디*/}</label>
                        </th>
                        <td>
                            <input
                                maxLength={12}
                                id="username"
                                type="text"
                                placeholder="영문,숫자 조합(8~12자)"
                                name='username'
                                value={username}
                                onChange={inputValue}
                                onBlur={checkId}
                                className={`${joinForm.input_text} ${joinForm.w260px}`} //" w260px"
                            />
                            <div style={{width: "auto"}}>
                                <div id="nameDiv" style={{
                                    marginLeft: "70px",
                                    color: "#B20710",
                                    fontSize: "10pt",
                                    textAlign: "left"
                                }}>{idDiv} </div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label htmlFor="ibxJoinInfoRegLoginPwd">
                                비밀번호*{/*비밀번호*/}
                            </label>
                        </th>
                        <td>
                            <input
                                maxLength={16}
                                id="password"
                                type="password"
                                name='password'
                                placeholder="비밀번호"
                                className={`${joinForm.input_text} ${joinForm.w260px}`} //" w260px"
                                value={password}
                                onChange={inputValue}
                                onBlur={(e) => {
                                    if (!e.target.value) {
                                        setInputPwdChk("필수 입력정보입니다");
                                    } else {
                                        setInputPwdChk("");
                                    }
                                }}
                            />
                            <div style={{width: "auto"}}>
                                <div id="nameDiv" style={{
                                    marginLeft: "65px",
                                    color: "#B20710",
                                    fontSize: "10pt",
                                    textAlign: "left"
                                }}>{inputPwdChk} </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label htmlFor="ibxJoinInfoRegLoginPwdConfirm">
                                비밀번호 확인*{/*비밀번호 확인*/}
                            </label>
                        </th>
                        <td>
                            <input
                                maxLength={16}
                                id="ibxJoinInfoRegLoginPwdConfirm"
                                type="password"
                                placeholder="비밀번호 확인"
                                className={`${joinForm.input_text} ${joinForm.w260px}`} //" w260px"
                                onChange={(e) => {
                                    if (password !== e.target.value) {
                                        setInputRePwdChk("비밀번호가 일치하지 않습니다");
                                        setDisable(true)
                                    } else {
                                        setInputRePwdChk("");
                                        setDisable(false)
                                    }
                                }}
                            />
                            <div style={{width: "auto"}}>
                                <div id="nameDiv" style={{
                                    marginLeft: "5px",
                                    color: "#B20710",
                                    fontSize: "10pt",
                                    textAlign: "left"
                                }}>{inputRePwdChk} </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label htmlFor="ibxJoinInfoRegEmail">
                                이메일 주소*{/*이메일 주소*/}
                            </label>
                        </th>
                        <td>
                            <input
                                maxLength={50}
                                id="email"
                                name="email"
                                type="email"
                                placeholder="이메일주소를 입력해 주세요"
                                className={`${joinForm.input_text} ${joinForm.w260px}`} //" w260px"
                                value={email}
                                onChange={inputValue}
                                onBlur={(e) => {
                                    if (regExp.test(e.target.value)) {
                                        setInputEmailChk("");
                                        setDisable(false);
                                    } else {
                                        setInputEmailChk("이메일 형식이 올바르지 않습니다");
                                        setDisable(true);
                                    }
                                }}

                            />
                            <div style={{width: "auto"}}>
                                <div id="nameDiv" style={{
                                    marginLeft: "40px",
                                    color: "#B20710",
                                    fontSize: "10pt",
                                    textAlign: "left"
                                }}>{inputEmailChk} </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            {/* marketing-agree */}
            <div className={`${joinForm.marketing_agree} ${joinForm.mt40}`}>   {/* mt40 */}
                <div className={joinForm.tit}>
                    마케팅 활용을 위한 개인정보 수집 이용 안내(선택)
                    {/*마케팅 활용을 위한 개인정보 수집 이용 안내(선택)*/}
                </div>
                <div className={joinForm.cont}>
                    <dl>
                        <dt>수집목적</dt>
                        <dd>
                            고객맞춤형 상품 및 서비스 추천, 당사 신규 상품/서비스 안내 및 권유,
                            사은/할인 행사 등 각종 이벤트 정보 등의 안내 및 권유
                        </dd>
                        <dt>수집항목</dt>
                        <dd>
                            이메일, 휴대폰번호, 주소, 생년월일, 선호영화관, 문자/이메일/앱푸쉬
                            정보수신동의여부, 서비스 이용기록, 포인트 적립 및 사용 정보, 접속로그{" "}
                        </dd>
                        <dt>보유기간</dt>
                        <dd>회원 탈퇴 시 혹은 이용 목적 달성 시 까지</dd>
                    </dl>
                    <div className={joinForm.radio_agree}>
                        <input type="radio" id="agree" name="marketing_agree"
                               value='동의'
                               checked={isAllChecked}
                               onClick={(e) => allChecked(e)}
                            //checked={!open1? false:!open2? false:!open3? false:true  }
                        />
                        <label htmlFor="agree" style={{marginRight: '20px'}}>&nbsp;동의{/*동의*/}</label>
                        <input
                            type="radio"
                            id="notagree"
                            name="marketing_agree"
                            value='미동의'
                            checked={!isAllChecked}
                            onClick={(e) => allChecked(e)}
                            className={joinForm.ml20}
                            defaultChecked
                        />
                        <label htmlFor="notagree">&nbsp;미동의{/*미동의*/}</label>
                    </div>
                    <div className={joinForm.mt30}>혜택 수신설정{/*혜택 수신설정*/}</div>
                    <div className={joinForm.benefit_agree}>
                        <input type="checkbox" id="push"
                               name='select-checked'
                               onClick={onOpen}
                               checked={open1}
                        />&nbsp;
                        <label htmlFor="push">&nbsp;알림{/*알림*/}</label>&nbsp;&nbsp;&nbsp;
                        <input type="checkbox" id="sms" className={joinForm.ml20}
                               name='select-checked'
                               onClick={onOpen}
                               checked={open2}
                        />
                        <label htmlFor="sms">&nbsp;SMS</label>&nbsp;&nbsp;&nbsp;
                        <input type="checkbox" id="email" className={joinForm.ml20}
                               name='select-checked'
                               onClick={onOpen}
                               checked={open3}
                        />
                        <label htmlFor="email">&nbsp;이메일{/*이메일*/}</label>
                    </div>
                    <div className={joinForm.mt20}>
                        ※ 이벤트, 신규 서비스, 할인 혜택 등의 소식을 전해 드립니다.
                        <br/>
                        (소멸포인트 및 공지성 안내 또는 거래정보와 관련된 내용은 수신 동의
                        여부와 상관없이 발송됩니다.)
                    </div>
                </div>
            </div>
            {/*// marketing-agree */}
            <div className={joinForm.btn_member_bottom}>
                <button
                    id="btnJoinInfoRegButton"
                    type="button"
                    className={`${joinForm.button} ${joinForm.purple} ${joinForm.large}`}
                    onClick={() => {
                        if (!(name && birth && phoneNumber && username && password && email)) {
                            alert("필수 정보를 입력해주세요");
                        } else if (certifOk === 1) {
                            alert("본인인증을 해주시기 바랍니다");
                        } else {
                            signUpActionHandler();
                        }
                    }}
                    disabled={disable}
                >
                    회원가입{/*회원가입*/}
                </button>
            </div>
        </>

    );
};

export default InfoMember;