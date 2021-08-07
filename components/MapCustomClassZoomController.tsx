import { useMap } from 'react-leaflet'
import React, { useEffect } from 'react'
import L from 'leaflet'


interface CustomZoomControlType {
  createClass: boolean,
  setCreateClass: (value:boolean) => void
}

export const MapCustomClassZoomControl: (props: CustomZoomControlType) => JSX.Element = (props:CustomZoomControlType) => {
  const map = useMap()
  useEffect(() => {
    function addControlPlaceholders(map) {
      const corners = map._controlCorners,
        l = 'leaflet-',
        container = map._controlContainer

      function createCorner(vSide, hSide) {
        const className = l + vSide + ' ' + l + hSide

        corners[vSide + hSide] = L.DomUtil.create('div', className, container)
      }

      if(!props.createClass){
        createCorner('verticalcenter', 'left')
        createCorner('verticalcenter', 'right')
        props.setCreateClass(true)
      }

    }

    addControlPlaceholders(map)
    // Change the position of the Zoom Control to a newly created placeholder.
  }, [props.createClass])
  return (<div/>)
}
