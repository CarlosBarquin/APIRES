import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { ObjectId } from 'mongodb';
import Link from "next/link";
import { GetServerSideProps, NextPage } from "next";

type Contact = {
  name: string;
  phone : string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const {id}  = context.query
    const lines = await fetch(`http://back:8080/contact?_id=${id}`);
    const data  = await lines.json();
    
    return {    
        props: {
            data
        }
    }

}



const Index = ({ data}: { data: Contact }) => {
   
    
    return (
      <>
        <h1>DATOS</h1>
        {data.name}
        {data.phone}

      </>
    )
  }


export default Index

/* const Page : NextPage<{id:string}> = ({id}) => {
    return (
        <>
            
        </>
    )
}

export default Page */