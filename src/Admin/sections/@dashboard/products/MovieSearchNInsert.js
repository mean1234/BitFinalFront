import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import {useEffect, useState} from "react";
import axios from "axios";
// import Button from 'src/Admin/theme/overrides/Button.ts';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});
// ----------------------------------------------------------------------

export default function MovieSearchNInsert() {
    const [status,setStatus] = useState(false)
    const [moviecdNum,setMoviecdNum] = useState('')
    const [movieSearchData,setMovieSearchData] = useState([])
    const [setQuery, setSetQuery] = useState('')
    const[apiData,setApiData] = useState([])
    const[otherQuery,setOtherQuery] = useState('')
    const[otherData,setOtherData] = useState([]);
    const url = '../movieapi/v1/search/movie.json';
    const url1 = '../moviesearch/movie?api_key=574ef45c366822b07b3a7f5799a6b116';
    const url2 = `../movieapp/${setQuery}?api_key=574ef45c366822b07b3a7f5799a6b116`;
    const url3 = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json';
    //네이버 영화 api
    const onSearch = () =>{

         //검색어 입력 안했을 시 
        if (moviecdNum.trim() === '') {
            alert("검색어를 입력해주세요.");
            return;
          }

        axios.get(url,{
            params:{query: moviecdNum,language: "ko"},
            headers: {
                'X-Naver-Client-Id': '_g6JfZzkITAmkjoExZi8',
                'X-Naver-Client-Secret': 'SqBOobPA63',
                'Accept': '*/*',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
         }).then(res => res.data.items.length === 0 ? alert("데이터 없음")|| setStatus(false)
                                                    : setMovieSearchData(res.data.items)||setStatus(true)
                )

    }
    useEffect(()=>{
        axios.get(url3,{
            params:{
                key: '0d28095f9f31dd96948bdf3a57f427d1',
                movieNm : moviecdNum
            }
        }).then(res => setOtherQuery(res.data.movieListResult.movieList[0].movieCd)
        )
    },[movieSearchData])


    useEffect(()=>{
        const url4 = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json';
        axios.get(url4,{
            params:{
                key: '0d28095f9f31dd96948bdf3a57f427d1',
                movieCd : otherQuery
            }
        }).then(res => setOtherData(res.data.movieInfoResult.movieInfo)
        )
    },[otherQuery])


    // 이미지 불러오기
    useEffect(()=>{
        if (moviecdNum === "") {
            return;
          }
    axios.get(url1, {
        params: {query: moviecdNum,language: "ko"},
        headers: {
            'Accept': '*/*',
            'Access-Control-Allow-Origin': '*',
        },
    })
    .then((res) => {
            if (res.data.results.length > 0) {
                setSetQuery(res.data.results[0].id)
            }
            else {
                alert("다시검색")
            }
        }
    )},[movieSearchData])

    

    useEffect(()=>{
        axios.get(url2, {
            params:{language: "ko"},
            headers: {
                'Accept': '*!/!*',
                'Access-Control-Allow-Origin': '*',
            },
       }).then(res => setApiData(res.data))
    },[setQuery])


    function dateCalculator(date,n){
        return new Date(date.setDate(date.getDate()+n));
    }
    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
    const [form, setForm] = useState({
        img_url: "",
        movie_class:"",
        movie_grade: "",
        movie_title: "",
        movie_release_start: "",
        movie_release_end: "",
        movie_reserve_rate:"",
        movie_already_release:""

    });
    const insertMovie = () => {

        // 날짜 형식 변환
        const movie_title = movieSearchData[0].title.replace('<b>','')
            .replace('</b>','').replace('<b>','').replace('</b>','').replace('<b>','')
            .replace('</b>','').replace('<b>','').replace('</b>','').replace('<b>','').replace('</b>','')
            .replace('<b>','').replace('</b>','').replace('<b>','').replace('</b>','').replace('<b>','').replace('</b>','')
            .replace('<b>','').replace('</b>','').replace('<b>','').replace('</b>','').replace('<b>','').replace('</b>','')
            .replace('<b>','').replace('</b>','');
        const movie_subtitle = movieSearchData[0].subtitle;
        const movie_poster_url = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2'+apiData.poster_path;
        const movie_header_url = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2'+apiData.backdrop_path;
        const movie_already_released = (apiData.status === "Realeased" ? 0 : 1);
        let reld = new Date(apiData.release_date);
        let reld2 = dateCalculator(reld,+31);
        const movie_release_start = apiData.release_date;
        const movie_release_end = formatDate(reld2);
        let start = new Date(movie_release_start);
        let now = new Date();
        const movie_class= (start < now) ? 1 : 2;
        const movie_agegrade= (otherData.audits.length === 0 ? "전체이용가" : otherData.audits[0].watchGradeNm);
        const movie_score = movieSearchData[0].userRating;
        const movie_info_title = apiData.overview;
        const movie_info_title2 = apiData.overview;
        const show = otherData.showTypes;
        const result = show.reduce(function add(sum,currValue){
            return sum+currValue.showTypeGroupNm+" "+currValue.showTypeNm+",";
        },"");
        const movie_info_type = '상영타입 : '+result+'감독 : '+movieSearchData[0].director+'등급 : '+ movie_agegrade+'개봉일 : '
            + movie_release_start+'출연진 : '+movieSearchData[0].actor;
        const form =
            [movie_title, movie_subtitle, movie_poster_url, movie_header_url, movie_already_released, movie_release_start,
                movie_release_end,movie_class,movie_agegrade,movie_score,movie_info_title,movie_info_title2,movie_info_type
                ];  

        // 영화 추가
         axios.post('http://localhost:8080/movielist/write',null,{
            params:{
              movie_title, movie_subtitle, movie_poster_url, movie_header_url, movie_already_released, movie_release_start,
              movie_release_end,movie_class,movie_agegrade,movie_score,movie_info_title,movie_info_title2,movie_info_type
        }
         }
            )
            // .then(res => alert(movie_title));
            .then((res)=>{
                alert(`${movie_title} 을(를)추가하였습니다.`)
               window.location.reload()
             }).catch(console.log('${movie_title} 을(를)추가'))

    }

    /* movie_number=null, movie_title=null,
        movie_subtitle=null, movie_poster_url=null,
        movie_header_url=null, movie_already_released=0,
        movie_release_start=null, movie_release_end=null, movie_class=null,
        movie_agegrade=null, movie_reserve_rate=null, movie_like=0, movie_totalspactators=null,
        movie_info_title=null, movie_info_title2=null, movie_info_type=null, movie_info_point=null
         /*  String movie_number = page 이동할때 number부여로 페이지이동
String movie_title = 영화제목 네이버
String movie_subtitle = 영화 부제목 네이버
String movie_poster_url = 전체영화, 영화소개에 들어가는 영화poster https://www.themoviedb.org/ poster_path
String movie_header_url = 영화소개에 들어가는 background poster https://www.themoviedb.org/ backdrop_path
int movie_already_released = 영화 개봉중/개봉예정을 구분 https://www.themoviedb.org/ status Released
String movie_release_start = 영화개봉날짜 https://www.themoviedb.org/ release_date
String movie_release_end = 영화개봉종료 https://www.themoviedb.org/ release_date+1month
String movie_class = class로 나눠서 타입별 영화탭 구분. default
String movie_agegrade = 영화나이제한 https://www.themoviedb.org/ adult
int movie_like = 좋아요 갯수 (쓰지않을 예정이지만 추가는 해놓음)
String movie_reserve_rate = 예매율 순위대로 리스트나열예정 // 예매테이블
String movie_score = 영화소개부분의 영화평점 네이버 userRating
String movie_ranking = 영화소개부분의 영화순위 score 값으로 순위
String movie_totalspactators = 영화소개부분의 총관람인원 //ㅇㅖ매 횟수로 해야될듯함
String movie_info_title = 영화소개부분의 영화소개 부분1 https://www.themoviedb.org/ overview
String movie_info_title2 = 영화소개부분의 영화소개 부분2 https://www.themoviedb.org/ overview
--영화소개를 1,2로 나눈 이유는 각 들어가는 css가 다름--
String movie_info_type = 영화소개부분의 영화 타입 https://www.themoviedb.org/
String movie_info_point = 영화소개에 들어갈그래프의 일종.  데이터가있어야 그래프가 완성됨.  */
    return (
        <>
            <span style={{fontSize:13,color:'green'}}>영화 추가</span>
            <br/>
            {   status === true ?
        <Card sx={{width:300,height:500}}>
            <Box sx={{ position: 'relative'}}>
                <Label
                variant="filled"
                color={(status === 'sale' && 'error') || 'info'}
                sx={
                    {
                        zIndex: 9,
                        top: 16,
                        right: 16,
                        position: 'absolute',
                        textTransform: 'uppercase',
                    }
                    }
                >
                </Label>
                <StyledProductImg alt={name} src={`https://www.themoviedb.org/t/p/w600_and_h900_bestv2`+apiData.poster_path} sx={{
                    display: 'inline-block',
                    width: '100%',
                    height: '500px',
                    overflow: 'hidden',
                    objectFit: 'cover',
                    borderRadius: '5px'
                }}/>
                </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
                <Link color="inherit" underline="hover">
                    <Typography variant="subtitle2" noWrap>
                    </Typography>
                </Link>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    {/* <ColorPreview colors={colors} /> */}
                    <Typography variant="subtitle1">
                        <Typography
                            component="span"
                            variant="body1"
                            sx={{
                                color: 'text.disabled',
                                textDecoration: 'line-through',
                            }}
                        >
                        </Typography>
                        &nbsp;
                    </Typography>
                </Stack>
            </Stack>
        </Card>
                : ""}

         <input id={moviecdNum} onChange={(e)=>setMoviecdNum(e.target.value)} placeholder='Add Movies...'
            style={{borderColor:'grey',borderRadius:10}}/>
        &nbsp;&nbsp;&nbsp;<Button onClick={onSearch} style={{color:'#4B0082'}}>Search</Button>
            {/* <Button onClick={insertMovie} style={{color:'#2F4F4F'}}>추가</Button> */}
        &nbsp;&nbsp;&nbsp; <Button onClick={ () => { if (window.confirm(`${moviecdNum} 영화을(를) 추가하시겠습니까?`)){ insertMovie(moviecdNum); }} } style={{color:'green'}}>Add</Button>

        </>
    );
}
