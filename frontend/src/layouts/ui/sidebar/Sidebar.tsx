import React from 'react'
import NavigationMenu from './ui/NavigationMenu'
import Playlists from './ui/playlists/Playlists'

const Sidebar = () => {
  return (
    <div className='bg-base-100/60 backdrop-blur-lg rounded-lg shadow-xl p-4 border border-white/10 flex flex-col gap-4'>
      <NavigationMenu/>
      <Playlists/>
    </div>
  )
}

export default Sidebar