<Modal show={inviteshow} onHide={handleInviteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Invite your Friends</Modal.Title>
        </Modal.Header>
        <Modal.Body> <ListGroup className='listgrp'>
            {users.map((item)=>(
            item.id !== auth.currentUser.uid
            ?
            <ListGroup.Item 
       className='user'>{item.username} 
       {groups.map((i,index)=>(
           
           i.adminid == auth.currentUser.uid?
           <Button key={index} onClick={()=>handleSendInvitation(item.id,item.username,i.groupname)} variant="primary">send</Button>
           :
           ""
           
           ))} 
       
       </ListGroup.Item>
       :
       ""
            ))}
      
    </ListGroup></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleInviteClose}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>

{groups.map((i)=>(
  
  <ListGroup className='listgrp'>


{members.map((item)=>(
item.id == auth.currentUser.uid &&  i.id === item.grpkey?
<ListGroup.Item className='user'>{item.sendername}</ListGroup.Item>
:
""
))}


</ListGroup>
))} 