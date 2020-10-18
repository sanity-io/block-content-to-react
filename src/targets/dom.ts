import * as React from 'react'
import {getSerializers} from '@sanity/block-content-to-hyperscript'

const renderNode = React.createElement

export const {defaultSerializers, serializeSpan} = getSerializers(renderNode)

export const renderProps = {
  nestMakrs: true,
}
