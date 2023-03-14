import { Helmet } from 'react-helmet-async';
// @mui
import { styled} from '@mui/material/styles';
import {Container, Typography, TablePagination,TableRow,TableCell} from '@mui/material';
import {filter} from 'lodash';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
// sections
import WriteForm from '../../component/store/WriteForm.js';
import { useEffect, useState } from 'react';

import axios from 'axios';
import StoreAdminBoardModalUpdatePage from '../../component/store/StoreAdminBoardModalUpdatePage .js';

// 관리자 store 관련

// ----------------------------------------------------------------------
const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 1000,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function AdminStore() {
  const mdUp = useResponsive('up', 'md');

  const [adminStoreList, setAdminStoreList] =useState([])
  
  const [stUpSeq1, setStUpSeq1] = useState('')
  
  // 관리자 store 리스트 전품목 가져오기
  useEffect(() => {
    axios
      .get('http://localhost:8080/store/getStoreList')
      .then((res) => {setAdminStoreList(res.data)})
      .catch((error) => console.log(error))
  }, []);



const StoreAdmin = adminStoreList.filter(item =>[{
    store_seq : item.store_seq,
    category: item.category,
    subject: item.subject,
    subSubject: item.subSubject,
    simpleContent: item.simpleContent,
    content: item.content,
    price: item.price,
    country: item.country,
    img: item.img,
    status: 'success'
}])


// 관리자 store 상품 삭제
const adminStoreDel = (storeDel) => {
  const storeSeq = adminStoreList.filter((item)=> item.store_seq !== storeDel)
  setAdminStoreList(storeSeq)
  axios.delete(`http://localhost:8080/store/adminStoreDel?store_seq=${storeDel}`)
        .then(()=>{alert('삭제완료')})
        .catch(error => console.log(error))
}

// ----

  const [adUpseq,setAdUpSeq] = useState('')
  const [open,setOpen]=useState('')
  const handleOpenMenu = (event) => {
  
  // 관리자 StoreAdminBoardModalUpdatePage의 seq 찾기 + 열기
  const ss = event.target.parentNode.id
  console.log(ss)
  setStUpSeq1(event.target.id)
  setOpen(event.currentTarget);

};


const [adminStoreSearchKeyword, setAdminStoreSearchKeyword] = useState('')
const [adminStoreSearchOption, setAdminStoreSearchOption]=useState('subject')

// 관리자 store 상품 리스트 검색
const onAdminStoreSearch = (e) => {
  e.preventDefault();
  axios.get('http://localhost:8080/store/adminStoreSearch',{
    params:{
      adminStoreSearchKeyword,
      adminStoreSearchOption
    }
  })
        .then(res => setAdminStoreList(res.data))
        .catch(err => console.log(err))
}

  return (
    <>
      <Helmet>
        <title> BIT BOX | STORE </title>
      </Helmet>
      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />
        {mdUp && (
          <StyledSection style={{width:300,height:780,textAlign:'center'}}>
            <Typography variant="h3" sx={{ px: 10, mt: 1, mb: 1 }}>
            BIT
            <br/>
            STORE
            </Typography>
            <img src="../../img/store22.png" alt="storeProduct" />
            <br/>
            <br/>
          </StyledSection>
        )}
        <Container maxWidth="s">
        <StyledSection style={{width:500,height:780}}>
          <WriteForm/>
          </StyledSection>
        </Container>
        <StyledSection  style={{width:800,height:780}}>
         <Typography variant="h3" sx={{ px: 1, mt: 1, mb: 3 }} style={{textAlign:'center'}}>
         BIT BOX STORE | List
         <div>
         <input type='text' placeholder='Search the Subject'style={{fontSize:20,height:30,background:'transparent',borderTop:'none',borderLeft:'none',borderRight:'none' ,borderBottomWidth:1}} name="adminStoreSearchKeyword" value={adminStoreSearchKeyword} onChange={e => setAdminStoreSearchKeyword(e.target.value)}/>
         <button style={{ all:'unset',color:'black',cursor:'pointer',fontSize:15}} onClick={onAdminStoreSearch} >
          &nbsp;&nbsp;&nbsp;&nbsp;Search</button>
         </div>
         </Typography>
        <table style={{overflowX:'scroll',width:800,height:780}}>
        <thead>
          <tr style={{fontSize:20,textAlign:'center',color:'blue'}}>
            {/* <th>store_seq</th> */}
            <th>Category</th>
            <th >Product Subject</th>
            <th >Detailed Content</th>
            <th >Price</th>
          </tr>
        </thead>
        <tbody>
        
          {adminStoreList.map((item) => {
            return (
              <>
              <tr key={item.store_seq} style={{fontSize:13,border:'10px solid white' }} value={item.store_seq}>
              {/* <td align="center">{item.store_seq}</td> */}
                {/* <td >{item.store_seq}</td> */}
                <td align="center">{item.category}</td>
                <td align="center">{item.subject}</td>
                <td align="center">{item.content}</td>
                <td align="center">{item.price}</td>
                &nbsp;&nbsp;
                <td>
                  <button onClick={ () => {
                     if (window.confirm(`${item.category} 카테고리의 ${item.subject} 상품을 삭제하시겠습니까?`)){ adminStoreDel(item.store_seq); }} } 
                     style={{all:'unset',color:'red',cursor:'pointer'}} > 삭제 </button>
                </td>

                {/* 관리자 store 상품 수정 */}
                <td id={item.store_seq} onClick={handleOpenMenu}>
                  <StoreAdminBoardModalUpdatePage id={item.store_seq} props={stUpSeq1}/>
                </td>
              </tr>
              </> 
            )
          })}
        </tbody>
      </table>
        </StyledSection>
      </StyledRoot>
    </>
  );
}
