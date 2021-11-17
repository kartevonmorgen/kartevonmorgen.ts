import { NextRouter } from 'next/router'
import { convertLatLngToString, isValidLatLng, LatLng } from './geolocation'
import { DEFAULTS } from '../consts/map'
import { updateRoutingQuery } from './utils'
import { createSlugPathFromQueryAndRemoveSlug, getRootSlugActionFromQuery } from './slug'
import { RootSlugEntity, SlugVerb } from './types'


export const setCenterAndZoom = async (
  router: NextRouter,
  center: LatLng,
  zoom: number = DEFAULTS.default_zoom,
) => {

  if (!isValidLatLng(center)) {
    console.warn('invalid center', center)
    return
  }

  const { query } = router

  const paramsToUpdate = {
    c: convertLatLngToString(center),
    z: zoom.toFixed(2),
  }

  const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  await router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}

export const setCenterAndZoomAndNewPin = (
  router: NextRouter,
  center: LatLng,
  zoom: number = DEFAULTS.default_zoom,
) => {
  const { query } = router

  const paramsToUpdate = {
    c: convertLatLngToString(center),
    z: zoom.toFixed(2),
    pinCenter: convertLatLngToString(center),
  }

  const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}

export const setNewPinMarkerOnMapIfCreateOrEdit = async (
  router: NextRouter,
  latLng: LatLng,
): Promise<void> => {

  const { query } = router

  const slugAction = getRootSlugActionFromQuery(query)
  const { subSlugAction } = slugAction

  const shouldAddPin: boolean = (subSlugAction !== null) &&
    (subSlugAction.entity === RootSlugEntity.EVENT || subSlugAction.entity === RootSlugEntity.ENTRY) &&
    (subSlugAction.verb === SlugVerb.CREATE || subSlugAction.verb === SlugVerb.EDIT)


  if (!shouldAddPin) {
    return
  }

  const paramsToUpdate = {
    pinCenter: convertLatLngToString(latLng),
  }

  const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  await router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}