import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../configs/axios'
import type { IAlbum } from '../../interfaces/interfaces'

interface AlbumResponse {
  data : IAlbum
}
const AlbumPage = () => {
  const params = useParams<{ id: string }>()
  const {data : album} = useQuery({
    queryKey: ['album', params.id],
    queryFn: async () =>{
      try {
        const {data} = await axiosInstance.get<AlbumResponse>(`/albums/${params.id}`)
        return data.data
      } catch (error) {
        console.error('Error fetching album:', error)
        throw error
      }
    }
  })
  return (
    <div>AlbumsPage</div>
  )
}

export default AlbumPage