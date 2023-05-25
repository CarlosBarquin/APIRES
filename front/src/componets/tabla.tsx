import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { ObjectId } from 'mongodb';
import Link from "next/link";

type Contact = {
  _id : ObjectId;
  name: string;
  phone : string;
}

const Formulario = styled.div`
  border: 1px solid #ccc;
  display: grid;
  grid-template-columns: 1fr 1fr 0.3fr;
  grid-gap: 1px;
  background-color: #fff;
  color: #444;
  margin-bottom: 50px;
`;

const Header = styled.div`
  background-color: #f1f1f1;
  font-weight: bold;
  padding: 20px;
  text-align: left;
`;

const Celda = styled.div`
  padding: 10px 20px 10px 20px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const Titulo = styled.div`
  background-color: blue;
  font-weight: bold;
  padding: 20px;
  text-align: left;
`;

const Button = styled.button`
  background-color: white;
  color: black;
  border: 2px solid red;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: red;
    color: white;
  }
`;

const Button2 = styled.button`
  background-color: white;
  color: black;
  border: 2px solid green;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: green;
    color: white;
  }
`;

const Input = styled.input`

`;

const MyComponent = () => {

  const [contacts, setContacts] = useState<Contact[]>([]);

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [cambia, setCambia] = useState<number>(0);


  useEffect(() => {
    const fetchData = async () => {
      const lines = await fetch(`http://localhost:8080/contacts`);
      const json = await lines.json();
      setContacts(json.contacts);
      console.log(json);
      
    };
    try {
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }, [name, phone, cambia])


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if(name == "" || phone == "") return

    const response = await fetch("http://localhost:8080/addContact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone }),
    });
    
    setCambia(cambia+1)
  };


 
  return (
    <div>
      <Titulo>CoNTactos</Titulo>
      <Formulario>
        <Header>Name</Header>
        <Header>Phone</Header>
        <Header></Header>
        
        <input placeholder="Name" type="text" onChange={(e) => setName(e.target.value)}></input>
        <input placeholder="Age" type="text"onChange={(e) => setPhone(e.target.value)} ></input>
        <Button2 onClick={handleSubmit}>ADD</Button2>
        {contacts.map((contact, index) => {
          const id = (contact._id).toString()
          return(
            <>
              <Celda>{<Link href={`/info/${id}`}>{contact.name}</Link>}</Celda>
              <Celda>{contact.phone}</Celda>
              <Button onClick={async () => {
                const _id = (contact._id).toString()
                await fetch("http://localhost:8080/deleteContact", {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ _id }),
                  
                });
                setCambia(cambia-1)
              }}>DELETE</Button>

            </>
          )

        })}  
      </Formulario>
    </div>
  );

};

export default MyComponent;
