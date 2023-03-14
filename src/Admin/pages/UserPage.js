import React, {createElement, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import {filter, sample} from 'lodash';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Select,
} from '@mui/material';
// components
import axios from "axios";
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { set } from 'date-fns';
import { tr } from 'date-fns/locale';
import {removeCookieToken} from "src/member/storage/Cookie";
import {useNavigate} from "react-router-dom";
// mock
/* <select  style={{width:120, height:30, textAlign:'center'}} name="adminSearchOption" onChange={e => setAdminSearchOption(e.target.value)}>
  <option id="adminTitle "value="title">TITLE</option>
  <option id="adminContent" value="content">CONTENT</option>
</select> */


const UserPage = () => {
  const setRole = () =>{
    const beforetext = document.getElementById(menuId).children[4].innerText
    const changeid = menuId;
    const changerow =  document.getElementById(menuId).children[4];
    const select = document.createElement('select')
    const option1 = document.createElement('option')
    const option2 = document.createElement('option')
    const button1 =  document.createElement('button')
    const button2 =  document.createElement('button')
    let changeRole = '';

    select.addEventListener(
        'change',
        function () { changeRole = this.value}
        )
    button1.addEventListener(
        'click',
        function (){ axios.get('http://localhost:8080/member/roleChange', {
          params: {username: changeid, roleType: changeRole}
        }).then(res => res.data==="equal" ? alert("이미 설정된 등급입니다"): alert(res.data)),
        window.location.reload()}
    )
    button2.addEventListener(
        'click',
        function (){changerow.innerHTML=beforetext}
    )
    option1.innerHTML='ROLE_ADMIN'
    option2.innerHTML='ROLE_USER'
    button1.innerHTML='수정'
    button2.innerHTML='취소'
    option1.setAttribute('value','ROLE_ADMIN')
    option1.setAttribute('select','selected')
    option1.setAttribute('text','ROLE_ADMIN')
    option2.setAttribute('value','ROLE_USER')
    option2.setAttribute('text','ROLE_USER')
    select.appendChild(option1)
    select.appendChild(option2)
    changerow.innerHTML=''
    changerow.appendChild(select)
    changerow.appendChild(button1)
    changerow.appendChild(button2)

    console.log(changerow)

  }
  const deleteUser = () => {

    axios.get('http://localhost:8080/member/delete',{
      params:{
        username:menuId
      }
    })
        .then(() =>alert('삭제성공'),window.location.reload())
        .catch(error => console.log(error))

  }
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }
  const TABLE_HEAD = [
    { id: 'name', label: '이름', alignRight: false },
    { id: 'id', label: '아이디', alignRight: false },
    { id: 'phoneNumber', label: '전화번호', alignRight: false },
    { id: 'role', label: '회원 등급', alignRight: false },
    { id: 'createDate', label: '가입일', alignRight: false },
    { id: '' },
  ];
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const[member, setMember] = useState([])

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const[menuId,setMenuId] = useState('')

  const accessToken = localStorage.getItem("accessToken");

  const navi = useNavigate();

  // 유저 리스트 뽑기, 헤더에 토큰담기(토큰 복호화 후 권한체크)
  useEffect(()=>{
    axios.get('http://localhost:8080/member/getUserList', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
        .then((res) =>setMember(res.data) )
        .catch(error => {
          console.log(error.response);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('expireTime');
          removeCookieToken();
          alert("관리자 권한이 없습니다");
          navi("/");
        })
  },[])


  const USERLIST = member.filter(item =>[{
    id: item.username,
    name : item.name,
    phoneNumber : item.phoneNumber,
    createDate : item.createDate,
    birth:item.birth,
    role: item.roleType,
    status : 'success',
    username:item.username
  }]);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
    setMenuId(event.currentTarget.id)
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((e) => e.username);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, username) => {
    const selectedIndex = selected.indexOf(username);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, username);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            유저
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { name, phoneNumber, createDate, roleType,username } = row;
                    const selectedUser = selected.indexOf(username) !== -1;

                    return (
                      <TableRow hover key={username} id={username} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, username)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{username}</TableCell>

                        <TableCell align="left">{phoneNumber}</TableCell>

                        <TableCell align="left">{roleType}</TableCell>
                        <TableCell align="left">{createDate}</TableCell>

                        <TableCell align="right"
                        >
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu} id={username} >
                            <Iconify icon={'eva:more-vertical-fill'}/>
                          </IconButton>
                        <Popover
                            open={Boolean(open)}
                            anchorEl={open}
                            onClose={handleCloseMenu}
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            PaperProps={

                              {
                                sx: {
                                  p: 1,
                                  width: 140,
                                  '& .MuiMenuItem-root': {
                                    px: 1,
                                    typography: 'body2',
                                    borderRadius: 0.75,
                                  },
                                },
                              }}
                        >
                          <MenuItem onClick={setRole} >
                            <Iconify icon={'eva:edit-fill'}  sx={{ mr: 2 }}/>
                            등급 조정
                          </MenuItem>
                          <MenuItem sx={{ color: 'error.main' }}  onClick={deleteUser}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                            회원 삭제
                          </MenuItem>
                        </Popover>
                      </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>


    </>
  );
}
export default UserPage;