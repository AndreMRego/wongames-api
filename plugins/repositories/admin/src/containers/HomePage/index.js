import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { Header } from '@buffetjs/custom';
import { Table } from '@buffetjs/core';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 18px 30px;

  p {
    margin-top: 1rem;
  }
`

const headers = [
  {
    name: 'Name',
    value:'name',
  },
  {
    name: 'Description',
    value:'description',
  },
  {
    name: 'Url',
    value:'html_url',
  },
];

const HomePage = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get('https://api.github.com/users/React-avancado/repos')
      .then(res => setRows(res.data))
      .catch(e => strapi.notification.error(`Ops...github API limit exceeded, ${e}`));
  },[])

  return (
    <Wrapper>    
      <Header 
        title={{ label: 'React Avançado Repositories'}} 
        content="A list of our repositories in React Avancado course." 
      />
      <Table headers={headers} rows={rows}/>
    </Wrapper>
  );
};

export default memo(HomePage);
