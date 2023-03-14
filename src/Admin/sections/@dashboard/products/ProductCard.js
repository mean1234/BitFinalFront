import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack,Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

ShopProductCard.propTypes = {
  product: PropTypes.object,
};


export default function ShopProductCard({ list,movieDelete }) {

  const { movie_number,movie_poster_url,movie_title,movie_release_start,movie_release_end,movie_agegrade} = list;
  // const { movie_poster_url,movie_title} = list;
  

  return (
    <>

    <Card >
      <Box sx={{ pt: '100%', position: 'relative' }} style={{height:500}}>
        <StyledProductImg src={movie_poster_url} />
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" style={{textDecoration: 'none'}}>
          <Typography variant="subtitle2" noWrap value={movie_title} style={{textAlign:'center'}}>
         <span className='adminMovie_movie_title' style={{color:'blue'}}> 영화 제목 : {movie_title}</span><br></br>
         <span className='adminMovie_Movie_agegrade'style={{color:'green'}}> 관람 등급 : {movie_agegrade}</span><br></br>
         <span className='adminMovie_movie_release_start' style={{color:'#8B4513'}}> 개봉 시작일 : {movie_release_start}</span><br></br>
         <span className='adminMovie_movie_release_end' style={{color:'#B8860B'}}> 개봉 종료일 : {movie_release_end}</span><br></br>
         <div className='adminMoveDeleteBtn' style={{textAlign:'right'}}>
         <Button  onClick={ () => { if (window.confirm(`${movie_title}를 삭제하시겠습니까?`)){ movieDelete(movie_title); }} }
           style={{color:'red'}} >삭제</Button>
            </div>
          </Typography>
        </Link>

      </Stack>
    </Card>
    </>
  );
}

