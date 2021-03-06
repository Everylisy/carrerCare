import React, { useContext, useState } from 'react';
import { Button, Form, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { DispatchContext } from '../../App';

import * as Api from '../../api';

function ChangePw({ user, setEditingPw, setUser }) {
  const [pw, setPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');
  const navigate = useNavigate();

  const curPwCheck = pw.length >= 1;
  const pwLengthCheck = newPw.length >= 4;
  const pwSameCheck = confirmNewPw === newPw;
  const pwCheckAll = pwLengthCheck && pwSameCheck && curPwCheck;

  const dispatch = useContext(DispatchContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //"users/password:id" PUT 요청
    const res = await Api.put(`users/password/${user.id}`, {
      pw,
      newPw,
    });

    const updatedUser = res.data; //백엔드에서 현재 비밀번호와 입력 비밀번호 대조, 불리언 값 리턴
    if (!updatedUser) {
      alert('현재 비밀번호가 일치하지 않습니다.'); //false면 리로드, 메세지 출력
      window.location = '/';
    } else {
      alert('비밀번호가 변경되었습니다!'); //true면 비밀번호 변경,
      setUser(updatedUser);
      setEditingPw(false);

      await sessionStorage.removeItem('userToken'); //토큰을 지워서 로그아웃 상태로 만들고, 로그인 페이지로 이동
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    }
  };

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Control
              type='password'
              autoComplete='on'
              placeholder='현재 비밀번호'
              onChange={(e) => setPw(e.target.value)}
            />
            {!curPwCheck && (
              <Form.Text className='text-success'>
                현재 비밀번호를 입력하세요.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Control
              type='password'
              autoComplete='on'
              placeholder='새 비밀번호'
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
            {!pwLengthCheck && (
              <Form.Text className='text-success'>
                비밀번호는 4글자 이상입니다.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Control
              type='password'
              autoComplete='on'
              placeholder='새 비밀번호 확인'
              onChange={(e) => setConfirmNewPw(e.target.value)}
            />
            {!pwSameCheck && (
              <Form.Text className='text-success'>
                비밀번호가 일치하지 않습니다.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group as={Row} className='mt-3 text-center'>
            <Col sm={{ span: 20 }}>
              <Button
                variant='primary'
                type='submit'
                className='me-3'
                disabled={!pwCheckAll}
              >
                확인
              </Button>
              <Button variant='secondary' onClick={() => setEditingPw(false)}>
                취소
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ChangePw;
