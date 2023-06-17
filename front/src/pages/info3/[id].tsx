import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { ObjectId } from 'mongodb';
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

type Contact = {
  name: string;
  phone: string;
}

type ContactIdsResponse = {
  ids: string[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const contactIdResponse = await fetch("http://back:8080/users");
  const contactIdsData: ContactIdsResponse = await contactIdResponse.json();

  const paths = contactIdsData.ids.map((id: string) => ({
    params: { id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;

  const contactDataResponse = await fetch(`http://back:8080/contact?_id=${id}`);
  const contactData: Contact = await contactDataResponse.json();

  return {
    props: {
      ID : id,
      data: contactData,
    },
  };
}

const Index: NextPage<{ data: Contact , ID : string }> = ({ data, ID }) => {

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [contacts, setContact] = useState<Contact>();
  const [cambia, setCambia] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const lines = await fetch(`http://localhost:8080/contact?_id=${ID}`);
      const contactData: Contact = await lines.json();
      setContact(contactData)
      
    };
    try {
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }, [name, phone, cambia])


  const handleUpdate = async () =>{
    if(name == "" || phone == "") return

    await fetch("http://localhost:8080/updateContact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id : ID , name, phone }),
    });
    setCambia(cambia+1)
  }
  return (
    <>
      <h1>DATOS</h1>
      {data.name}--
      {data.phone}
      <h2>UPDATE</h2>
      <input placeholder="Name" type="text" onChange={(e) => setName(e.target.value)}></input>
      <input placeholder="Age" type="number"onChange={(e) => setPhone(e.target.value)} ></input>
      <button onClick={handleUpdate}>UPDATE</button>
      <h3>datos2</h3>
      {contacts?.name}
      {contacts?.phone}
    </>
  );
}

export default Index;
