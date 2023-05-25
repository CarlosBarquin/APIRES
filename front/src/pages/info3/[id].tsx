import React from "react";
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
      data: contactData,
    },
  };
}

const Index: NextPage<{ data: Contact }> = ({ data }) => {
  return (
    <>
      <h1>DATOS</h1>
      {data.name}
      {data.phone}
    </>
  );
}

export default Index;
