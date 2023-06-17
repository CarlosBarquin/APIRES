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
  grid-template-columns: 1fr 1fr 1fr 0.3fr;
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

const Celda2 = styled.div`
  padding: 10px 20px 10px 20px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  background-color: powderblue;
  transition: background-color .5s;

  &:hover {
    background-color: gold;

  }
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
  const [name2, setName2] = useState<string>("");
  const [phone2, setPhone2] = useState<string>("");
  const [cambia, setCambia] = useState<number>(0);

  const [visi, setVisi] = useState<boolean>(false)
  const [ID , setID] = useState<string>("")



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

    await fetch("http://localhost:8080/addContact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone }),
    });
    
    setCambia(cambia+1)
  };

  const handleVisi = () =>{
    setVisi(!visi)
  }
 
  return (
    <div>
      <Titulo>CoNTactos</Titulo>
      <Formulario>
        <Header>Name</Header>
        <Header>Phone</Header>
        <Header></Header>
        <Header></Header>
        
        <input placeholder="Name" type="text" onChange={(e) => setName(e.target.value)}></input>
        <input placeholder="Age" type="number"onChange={(e) => setPhone(e.target.value)} ></input>
        <Button2 onClick={handleSubmit}>ADD</Button2>
        <Celda></Celda>
        {contacts.map((contact, index) => {
          const id = (contact._id).toString()
          return(
            <>
              <Celda>{<Link href={`/info/${id}`}>{contact.name}</Link>}</Celda>
              <Celda2 onClick={async ()=>{
                handleVisi()
                const ID2 = (contact._id).toString()
                setID(ID2)
                

                
              }}>{contact.phone}</Celda2>
              <Button onClick={async () => {
                await fetch("http://localhost:8080/deleteContact", {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ _id : id }),
                  
                });
                setCambia(cambia-1)
              }}>DELETE</Button>

  
                <Link href={`/info3/${id}`}>
                  <Button>UPDATE</Button>  
                </Link>   

              {(visi && ID === contact._id.toString() && (
                <>
                    <input placeholder="Name" type="text" onChange={(e) => setName2(e.target.value)}></input>
                    <input placeholder="Age" type="number"onChange={(e) => setPhone2(e.target.value)} ></input>
                    <Button2 onClick={async () =>{
                        await fetch("http://localhost:8080/updateContact", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ _id : id , name: name2, phone: phone2 }),
                          
                        });
                        setCambia(cambia+1)
                    }}>UPDATE</Button2>
                      <Celda></Celda>
                </>
              ))}
            </>
          )

        })}  
      </Formulario>
    </div>
  );

};

export default MyComponent;
