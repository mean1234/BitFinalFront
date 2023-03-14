import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfoStyle from '../css/InfoStyle.css';
import '../css/Tt.css';
import DetailInfo_Tab from './DetailInfo_Tab';
import DetailRate_Tab from './DetailRate_Tab';
import StillCut_Tab from './StillCut_Tab';
import Layout from 'src/Main/Layout';
import Footer from 'src/Main/Footer';


const MovieDetail_Page = (props) => {

const { movie_title } = useParams()
const [item, setItem]=useState({});
const [commentList,setCommentList]=useState([])

    

    useEffect(() => {
        axios.get('http://localhost:8080/movielist/getMovieList_boxoffice')
        .then(res => {
            var movieData = res.data
            setItem(movieData.find(item => item.movie_title === movie_title))
        })
        axios.get(`http://localhost:8080/movielist/getComments?title=${movie_title}`)
            .then(res => { setCommentList(res.data) })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {

        ageURL()

    },[item])

    useEffect(()=>{
        setIndex(0);
    },[commentList])

    const toggleMenu = (
    [
        {
       id: 0,
       title: "주요정보",
       tab: <DetailInfo_Tab commentList={ commentList } />
        },
       {
        id : 1,
        title: "실관람평",
        tab: <DetailRate_Tab commentList={ commentList } />
       },
       {
       id: 2,
       title: "예고편",
       tab: <StillCut_Tab />
        }
    ])



    

    const [ageIcon, setAgeIcon] = useState('')
    const ageAll = 'https://img.megabox.co.kr/static/pc/images/common/txt/ALL_46x46.png'
    const age12 = 'https://img.megabox.co.kr/static/pc/images/common/txt/12_46x46.png'
    const age15 = 'https://img.megabox.co.kr/static/pc/images/common/txt/15_46x46.png'
    const age19 = 'https://img.megabox.co.kr/static/pc/images/common/txt/19_46x46.png'

    const ageURL = () => {
        item.movie_agegrade === "청소년관람불가" 
            ? setAgeIcon(age19) : item.movie_agegrade === "15세이상관람가" 
            ? setAgeIcon(age15) : item.movie_agegrade === "12세이상관람가"
            ? setAgeIcon(age12) : 
            setAgeIcon(ageAll) 
    }
   
    const [index, setIndex] = useState('');

    return (
        <>
        <Layout>
            <div className='detailwrap' style={{ margin: 'auto' }}>
                <div className='container'>
                  <div className='headerBg' style={{ margin: 'auto' }} >
                        <img className='headerImg' style={{ margin: 'auto', paddingLeft: 140, position: 'absolute' }} src={ item.movie_header_url } />
                    <div className='section'>
                        <div className='backgroundMask'>
                            <div className='header' style={{ margin: 'auto' }}>
                                {/* 영화타이틀 */}
                                <br/>
                                {/* <p className='hash' style={{ marginTop: 30 }}>&nbsp;{ dolby }</p> */}
                                <br/><br/><br/>
                                <p className='movieTitle' style={{ marginTop: -10 }}>{ item.movie_title }</p>
                                <h3 style={{ marginTop: -20 }}>{ item.movie_subtitle }</h3>
                                <div id="headerBtn">
                                    {/* <button className='likeBtn' style={{ }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-heart" width="18" height="18" viewBox="0 -4 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                                        </svg>
                                        &nbsp; { item.Like }
                                    </button> &nbsp; */}
                                    {/* <button className='sharBtn' style={{ paddingRight: 11, paddingBottom: 5 }}>
                                    
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="18" height="18" viewBox="0 -3 24 25" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <circle cx="6" cy="12" r="3"></circle>
                                            <circle cx="18" cy="6" r="3"></circle>
                                            <circle cx="18" cy="18" r="3"></circle>
                                            <line x1="8.7" y1="10.7" x2="15.3" y2="7.3"></line>
                                            <line x1="8.7" y1="13.3" x2="15.3" y2="16.7"></line>
                                        </svg>
                                        &nbsp; 공유하기
                                    </button> */}
                                </div>
                                {/* 영화평 */}
                                
                                <div id="info" style={{ position: 'absolute', fontWeight: 600, bottom: -30}}>
                                    <div id="score">
                                        <p className='rateTit' style={{ bottom: -170 }}>실관람 평점</p>
                                        <div className='mainMegaScore' style={{ bottom: -155 }}>
                                            <p>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <rect x="7" y="3" width="14" height="14" rx="2"></rect>
                                                <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"></path>
                                            </svg>
                                            &nbsp;<span style={{ color: '#c47c7c' }}>{ item.movie_score }</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div id="rate">
                                        <p style={{ position: 'relative', bottom: -67, fontSize: '11pt',fontWeight: 600, marginLeft: 100 }}>
                                            예매율</p>
                                        <p style={{ position: 'relative', bottom: -50, marginLeft: 100,}}>
                                            <span style={{ fontWeight: '600', fontSize: '25pt'}}>
                                            {/* icon-tabler icon-tabler-ticket */}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <line x1="15" y1="5" x2="15" y2="7"></line>
                                                    <line x1="15" y1="11" x2="15" y2="13"></line>
                                                    <line x1="15" y1="17" x2="15" y2="19"></line>
                                                    <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2"></path>
                                                </svg>
                                                &nbsp;{ item.movie_like } </span>
                                            위 ({ item.movie_reserve_rate }%)
                                        </p>
                                    </div>

                                    <div id="audience">
                                        <div style={{ position: 'relative', bottom: 40, fontSize: '11pt', fontWeight: 600, marginLeft: 250 }}>
                                             <span>누적관객수 
                                                    <div className='detailTooltip' style={{ marginLeft: 5, padding: 1 }}> ?
                                                        <div className='detailTooltipText'>
                                                            <div className='tooltipTextBottom'>
                                                                <div className='tooltipContent'>
                                                                    <div>
                                                                    누적관객 및 전일관객은 영화진흥 위원회<br/>
                                                                    영화관 입장권 통합전산망제공 기준입니다.<br/>
                                                                    (2022.12.29기준)
                                                                    </div>
                                                                </div>
                                                            </div>        
                                                        </div>
                                                    </div>
                                             </span>
                                        </div>

                                        <p style={{ position: 'relative', marginLeft: 250, bottom: 40 }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-users" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <circle cx="9" cy="7" r="4"></circle>
                                                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                                            </svg>
                                            <span style={{ fontWeight: 600, fontSize: '25pt'}}> { item.movie_totalspactators }</span> 명</p>
                                    </div>
		                        </div>
                                {/* 포스터 */}
                                <div className='poster' style={{ right: 0, top: 46 }}>
                                    <img className='poster' src={ item.movie_poster_url } />
                                    <div className='ageIcon' style={{ margin: 5 }}>
                                        <img className='ageIcon' src={ ageIcon } />
                                    </div>
                                    {/* <div className='downPst' style={{ margin: 5 }} /> */}
                                </div>{/* poster */} 
                                {/* {
                                    dolby === '#돌비시네마' &&
                                    <div style={{ position: 'absolute', display: 'flex', right: 0, bottom: 35 }}>
                                        <a href="#" className='reserveBtn'>예매</a>
                                        <a href="#" className='dolbyBtn'>돌비시네마</a>
                                    </div>
                                } */}
                                {/* {
                                    dolby === '' && */}
                                    <div style={{ position: 'absolute', display: 'flex', right: 0, bottom: 35 }}>
                                    <a href={`/user/calendar/${item.movie_title}`} className='reserveBtn2'>예매</a>
                                    </div>
                                {/* } */}
                                
                                </div>{/* header */} 
                            </div>{/* backgroundMask */}
                                
                                {/* 탭토글 */}
                                <div style={{ display: 'block' }}>
                                    <ul className='tab' style={{ margin: 'center', padding: 0, marginTop: 30, cursor: 'pointer' }}>
                                        { toggleMenu.map(item => (
                                            <li className={ index === item.id ? 'tabIndex' : 'tabIndex2' } key={ item.id }
                                            onClick={() => setIndex(item.id)} style={{ lineHeight: 2.5 }}>
                                                { item.title }
                                            </li>
                                        ))
                                        }
                                    </ul>
                                </div>
                                <div style={{ display: 'block' }}>
                                    { 
                                    toggleMenu.filter(item => index === item.id).map((item,index) => (
                                        <div key={index} style={{ margin: 40}} className='tabContent' >{ item.tab }</div>
                                        ))    
                                        
                                    }
                                </div>
                            <Footer />
                        </div>{/* section  */}
                    </div> 
                    {/* headerBg */}
                </div>{/* container */}   
            </div> {/* wrap */}
        </Layout>
        </>
    );
};

export default MovieDetail_Page;