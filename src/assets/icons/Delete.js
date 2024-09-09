import * as React from "react"
import Svg, { G, Circle, Path } from "react-native-svg"

function Delete(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props.size ? props.size : 12} height={props.size ? props.size : 15.6} viewBox="0 0 12 15.6">
      <Path id="b7404d7061d642bc0daa3e11a64b777e" d="M97.2,77a1.6,1.6,0,0,0,1.6,1.6h6.4a1.6,1.6,0,0,0,1.6-1.6V67.8H97.2ZM108,65.4h-3L104,63H100l-1,2.4H96v1.2h12Z" transform="translate(-96 -63)" fill={props.fillColor} />
    </Svg>
  )
}

export default Delete
