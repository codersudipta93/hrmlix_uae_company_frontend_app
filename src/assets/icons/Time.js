import * as React from "react"
import Svg, { G, Circle, Path } from "react-native-svg"

function Time(props) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={props?.width ? props.width: 10} height= {props.height} viewBox="0 0 26.037 27.463">
            <G id="_4d56fd253ec71226416704384a30ac36" data-name="4d56fd253ec71226416704384a30ac36" transform="translate(-2.482 -2)">
                <Circle id="Ellipse_359" data-name="Ellipse 359" cx="5.296" cy="5.296" r="5.296" transform="translate(2.5 2)" fill={props.color} />
                <Circle id="Ellipse_360" data-name="Ellipse 360" cx="5.296" cy="5.296" r="5.296" transform="translate(17.907 2)" fill={props.color} />
                <Circle id="Ellipse_361" data-name="Ellipse 361" cx="12.519" cy="12.519" r="12.519" transform="translate(2.981 3.926)" fill={props.color} stroke="#fff" stroke-width="1" />
                <Path id="Path_4999" data-name="Path 4999" d="M20.046,20.787a.963.963,0,0,1-.684-.279l-4.083-4.083A.963.963,0,0,1,15,15.741V9.963a.963.963,0,1,1,1.926,0v5.383l3.852,3.794a.945.945,0,0,1-.732,1.647Z" transform="translate(-0.463 -0.259)" fill="#fff" />
            </G>
        </Svg>


    )
}

export default Time