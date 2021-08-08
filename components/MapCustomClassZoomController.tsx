import { useMap } from 'react-leaflet'
import React, { FC, useEffect } from 'react'
import L from 'leaflet'


interface CustomZoomControlProps {
  createClass: boolean,
  setCreateClass: (value:boolean) => void
}

export const MapCustomClassZoomControl:FC<CustomZoomControlProps> = (props:CustomZoomControlProps) => {

  const map = useMap()

  function addControlPlaceholders(map) {
    const corners = map._controlCorners,
      l = 'leaflet-',
      container = map._controlContainer

    function createCorner(vSide, hSide) {
      const className = l + vSide + ' ' + l + hSide

      corners[vSide + hSide] = L.DomUtil.create('div', className, container)
    }

    createCorner('verticalcenter', 'left')
    createCorner('verticalcenter', 'right')
    props.setCreateClass(true)

  }

  useEffect(() => {
    if(!props.createClass) addControlPlaceholders(map)
  }, [props.createClass])

  return (<></>)
}
