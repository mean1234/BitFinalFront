import axios from 'axios';
import React, { useState , useEffect} from 'react';
import search_icon from '../img/search_icon.png';
// import fullheart from '../img/fullheart.png';
// import emptyheart from '../img/emptyheart.png';
import { Link } from 'react-router-dom';



const Movielist_tab01 = () => {
    
    const [list, setList] = useState([]);
    const [movie_count, setMovie_count] = useState(0);

    const [searchOption, setSearchOption] = useState('movie_title');
    const [keyword, setKeyword] = useState('');
    const [already_released, setAlready_released] = useState(false);
 
    // const [movielike_Btn_img,setMovielike_Btn_img] = useState(false); // 이미지 토글


    const movie_already_released_check = () => {
        setAlready_released(!already_released) 
    }
    // const movie_like_one = (target_title) => {
    //     setMovielike_Btn_img(!movielike_Btn_img);
    //     console.log(movielike_Btn_img)
    //     axios.get(movielike_Btn_img ? `http://localhost:8080/movielist/movie_like_minus_one?movie_title=${target_title}` : `http://localhost:8080/movielist/movie_like_one?movie_title=${target_title}`)
    //         .then(res => (already_released ? movie_already_release_filter(): movie_add_list()))
    //         .catch(err => console.log(err))
    // }

    const [the_number_of_movielist, setThe_number_of_movielist]  = useState(20);
    const [movielist_release_filter, setMovielist_release_filter] = useState(20);
    
    useEffect(() => {
        (already_released ? movie_already_release_filter(): movie_add_list())
        },[already_released, list.movie_like]);

    const movie_add_list = () => {
        axios.get('http://localhost:8080/movielist/getMovieList_boxoffice')
            .then(res => {setMovie_count(res.data.length)
                console.log("전체영화리스트 = " + the_number_of_movielist) 
                setList(res.data.splice(0,the_number_of_movielist))
                })
            .catch(err => console.log(err))
    }

    const movie_already_release_filter = () => {
        axios.get('http://localhost:8080/movielist/getMovieList_already_on_boxoffice')
            .then(res => {setMovie_count(res.data.length)
                console.log("개봉중인 영화 리스트 = " + movielist_release_filter) 
                setList(res.data.splice(0,movielist_release_filter))})
            .catch(err => console.log(err))
    }

    // const movie_add_list = () => {
    //     setThe_number_of_movielist(the_number_of_movielist + 20);
    //     getMovieList()
    // }

    // const movie_add_filter_list = () => {
    //     setMovielist_release_filter(the_number_of_movielist + 20);
    //     getMovieList_filter()
    // }

    const  movie_add_total_list = () => {
        axios.get('http://localhost:8080/movielist/getMovieList_boxoffice')
            .then(res => {setMovie_count(res.data.length)
                setThe_number_of_movielist(the_number_of_movielist + 20);
                console.log("전체영화리스트 = " + the_number_of_movielist) 
                setList(res.data.splice(0,the_number_of_movielist + 20))
                })
            .catch(err => console.log(err))
    }

    const movie_add_filter_list = () => {
        axios.get('http://localhost:8080/movielist/getMovieList_already_on_boxoffice')
            .then(res => {setMovie_count(res.data.length)
                setMovielist_release_filter(movielist_release_filter => movielist_release_filter + 20) 
                console.log("개봉중인 영화 리스트 = " + movielist_release_filter) 
                setList(res.data.splice(0,movielist_release_filter + 20))})
            .catch(err => console.log(err))
    }

    // const getMovieList = () => {
    //     axios.get('http://localhost:8080/movielist/getMovieList_boxoffice')
    //         .then(res => {setMovie_count(res.data.length)
    //             console.log("전체영화리스트 = " + the_number_of_movielist) 
    //             setList(res.data.splice(0,the_number_of_movielist))
    //             })
    //         .catch(err => console.log(err))
    //         }

    // const getMovieList_filter = () => {
    //     axios.get('http://localhost:8080/movielist/getMovieList_already_on_boxoffice')
    //         .then(res => {setMovie_count(res.data.length)
    //             console.log("개봉중인 영화 리스트 = " + movielist_release_filter) 
    //             setList(res.data.splice(0,movielist_release_filter))})
    //         .catch(err => console.log(err))
    // }

    const onSearch = () => {
        axios
            .get('http://localhost:8080/movielist/Movie_search_boxoffice', {
                    params : {
                        searchOption : searchOption,
                        keyword: keyword
                    }})
            .then(res => {setList(res.data) 
                 setMovie_count(res.data.length)})
            .catch(error => console.log(error))
    };

    const handleOnClick = () => {
        onSearch();
    }

    const onSubmitSearch = (e) => {
        //키를 눌렀을 때 동작할 코드
        if (e.key === "Enter") {
            handleOnClick();
        }
      }; 

    return (
        <div>
            <div className="Movielist_checksearch">
                <div className='Movielist_checkbox'> 
                    <input type="checkbox" id="Movielist_toggle" onClick={movie_already_released_check} hidden /> 
                    <label htmlFor="Movielist_toggle" className="Movielist_toggleSwitch">
                        <span className="Movielist_toggleButton"></span>
                        <div className='Movielist_checkbox_only'>개봉작만 &nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </label>
                        <div className='Movielist_moviecount'>{movie_count} 개의 영화가 검색되었습니다.</div>
                    <div>
                        <input type="text" id='Movielist_search' name='Movielist_search' value={keyword}
                                onChange={e=> setKeyword(e.target.value)} onKeyDown={onSubmitSearch} placeholder="&nbsp;영화명 검색"/>
                        <img src={search_icon} name='search_icon' id='search_icon' alt='검색돋보기' onClick={onSearch}/>
                    </div>
                </div>
            </div>

            <div className='Movielist_movietitle'>
                {
                    list.map ((item, index) => {
                        return (
                            <div key={index}>
                                <ol className='Movielist_seq' >
                                    <li>
                                <Link to={`/movieDetail_Page/${item.movie_title}`} className='Movielist_title_Link'>
                                        <div className='Movielist_title_num'>{index+1}</div>
                                        <div>
                                            <img className='Movielist_title_img' src={item.movie_poster_url}/>
                                            <div className="movie-score" >        
                                                <a href="#" className="movielist_info">
                                                    <div className="movielist_summary">&lt;{item.movie_title}&gt;
                                                    {item.movie_info_title}
                                                    {item.movie_info_title2}
                                                    </div>
                                                    {item.movie_already_released === 0 ?     
                                                    <div className="movielist_moviescore">                
                                                        <div className="movielist_moviescore_preview">                    
                                                            <p className="movielist_moviescore_tit">관람평</p>                    
                                                            <p className="movielist_moviescore_number">{item.movie_score}</p>                 
                                                        </div>            
                                                    </div>: false}        
                                                </a>    
                                            </div>
                                        </div>
                                        <div className='Movielist_title_area'>
                                            <img className='Movielist_grade_age'
                                               src={item.movie_agegrade === "전체관람가" ? '/storage/00.png':
                                                    item.movie_agegrade === "전체이용가" ? '/storage/00.png':
                                                    item.movie_agegrade === "12세이상관람가" ? '/storage/12.png':
                                                    item.movie_agegrade === "15세이상관람가" ? '/storage/15.png':
                                                    item.movie_agegrade === "청소년관람불가" ? '/storage/18.png':false}/>
                                            <p className='Movielist_title_maintitle'>{item.movie_title}</p>
                                        </div>
                                        <div className='Movielist_title_ratedate'>
                                            <span className='Movielist_title_rate'> 예매율 {item.movie_reserve_rate}%  |</span>
                                            <span className='Movielist_title_date'> &nbsp;개봉일 {item.movie_release_start}</span>
                                        </div>
                                        
                                        {/* <div className='Movielist_Btnlist'>
                                            <input type='button' className="Movielike_Btn" value={item.movie_like} 
                                                    onClick={() => {movie_like_one(item.movie_title)}}>
                                            </input>
                                            {movielike_Btn_img ? 
                                            <img src={fullheart} id='movie_heart_img' alt='좋아요'
                                                onClick={() => movie_like_one(item.movie_title)}/>
                                            : 
                                            <img src={emptyheart} id='movie_heart_img' alt='좋아요' 
                                                onClick={() => movie_like_one(item.movie_title)}/>
                                            }
                                        </div> */}
                                    </Link>
                                        <a href={`/user/calendar/${item.movie_title}`} className="movielist_Btn_change">
                                            {item.movie_already_released === 0 ?
                                                <input type='button' className='Movie_Btn_reserve' value="예매"></input>:
                                                <input type='button' className='Movie_Btn_reserve_yet' value="개봉예정" disabled></input>}
                                        </a>
                                    </li>
                                    {index === list.length-1 ? ( list.length < 99 ? (already_released === false? (list.length % 20 == 0 ?
                                    <input type='button' onClick={ movie_add_total_list } className='Movielist_add_button' value="더보기" ></input>:false):false):false):false}

                                    {index === list.length-1 ? ( list.length < 99 ? (already_released === true? (list.length % 20 == 0 ? 
                                    <input type='button' onClick={ movie_add_filter_list } className='Movielist_add_button' value="더보기" ></input>:false):false):false):false}

                                    </ol>
                            </div>
                        )
                    })
                }
            </div>
            
        </div>
    );
};

export default Movielist_tab01;