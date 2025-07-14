import React from 'react'
import ContainerHeader from '../container-components/ContainerHeader'
import ContainerBody from '../container-components/ContainerBody'
import ContainerFooter from '../container-components/ContainerFooter'
import useUserStore from '../../../store/userStore'

const ChatContainer = () => {
    const {selectedUser} = useUserStore();
  return (
    <div className={`relative md:w-[70vw] w-full h-[100vh] bg-[#16161b] text-white ${selectedUser === null ? 'hidden' : ''}`}>
      <ContainerHeader />
      <ContainerBody/>
      <ContainerFooter/>
    </div>
  )
}

export default ChatContainer
