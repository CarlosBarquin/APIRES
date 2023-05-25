import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";

type Contact = {
  name: string;
  phone: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {

    const {id}  = context.query

    return {    
        props: {
            id
        }
    }

}

const Page : NextPage<{id:string}> = ({id}) => {
    const [contactInfo, setContactInfo] = useState<Contact | null>(null);
    const contactId = id
  
    useEffect(() => {
      const fetchContactInfo = async () => {
        try {
          const response = await fetch(`http://localhost:8080/contact?_id=${contactId}`);
          const data = await response.json();
          setContactInfo(data);
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchContactInfo();
    }, []);
  
    return (
      <div>
        <h1>Contact Information</h1>
        {contactInfo ? (
          <div>
            <p>Name: {contactInfo.name}</p>
            <p>Phone: {contactInfo.phone}</p>
          </div>
        ) : (
          <p>Loading contact information...</p>
        )}
      </div>
    );
}

export default Page