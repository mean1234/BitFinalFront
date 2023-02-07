import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, Stack, Typography,Button } from '@mui/material';
// components
// import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import {ProductSort, ProductList, ProductCartWidget, MovieSearchNInsert} from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };


const [list, setList] = useState([]);
useEffect(() => {
    axios.get('http://localhost:8080/movielist/admin_movie_list')
    .then(res => setList(res.data))
    .catch(err => console.log(err))
},[])


const movieDelete = (movieTitle)=> {
  const movieDeleteList = list.filter((item)=> item.movie_title !== movieTitle);
  setList(movieDeleteList);
  axios.delete(`http://localhost:8080/movielist/admin_movie_delete?movie_title=${movieTitle}`)
        .then(()=>{alert('삭제 완료')})
        .catch(error => console.log(error))
  
  }

  // movie search
  const [adminMovieSearchKeyword , AdminMovieSearchKeyword] = useState('')
  const [adminMovieSearchOption, AdminMovieSearchOption ]= useState('movie_title')

  const onAdminMovieSearch = (e) => {
    e.preventDefault();
    axios.get('http://localhost:8080/movielist/adminMovieSearch',{
      params: {
        adminMovieSearchKeyword,
        adminMovieSearchOption
      }
    })
          .then(res =>setList(res.data))
          .catch(error => console.log(error))
  }

  const onAdminMovieReload = (e) => {
    e.preventDefault();
    window.location.reload();
  }

  return (
    <>
      <Helmet>
        <title> Admin | BIT BOX MOVIE LIST </title>
      </Helmet>

      <Container>
        <Typography variant="h3" sx={{ mb: 5 }}>
          Movie List
         </Typography>
        <div>
          <MovieSearchNInsert/>
        </div>
        <br/>
        <hr style={{width:330}}/>
        <br/>
       <span style={{fontSize:13,color:'red'}}>등록된 영화 검색</span>
        <div>
          <input type="text" name="adminMovieSearchKeyword" value={adminMovieSearchKeyword} onChange={e => AdminMovieSearchKeyword(e.target.value)} placeholder="Search Movies..." style={{borderColor:'grey',borderRadius:10}}
           />&nbsp;&nbsp;&nbsp;<Button onClick={onAdminMovieSearch} style={{color:'red'}}>Search</Button>
              &nbsp;&nbsp;&nbsp;<Button onClick={onAdminMovieReload}>back</Button>
        </div>
        <br/>
        <hr style={{width:330}}/>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={PRODUCTS} list={list} movieDelete={movieDelete}/>
      </Container>
    </>
  );
}
