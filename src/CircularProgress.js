import React from 'react';
import { View } from 'react-native';
import { G, Path, Svg, Text, TextPath } from 'react-native-svg';

export default class CircularProgress extends React.PureComponent {
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  circlePath(x, y, radius, startAngle, endAngle) {
    var start = this.polarToCartesian(x, y, radius, endAngle * 0.9999);
    var end = this.polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y];
    return d.join(' ');
  }

  circleInnerPath(x, y, radius, startAngle, endAngle) {
    var end = this.polarToCartesian(x, y, radius, endAngle * 0.9999);
    var start = this.polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y];
    return d.join(' ');
  }

  clampFill = fill => Math.min(100, Math.max(0, fill));

  render() {
    const {
      size,
      width,
      backgroundWidth,
      tintColor,
      tintTransparency,
      backgroundColor,
      style,
      rotation,
      lineCap,
      fillLineCap = lineCap,
      arcSweepAngle,
      fill,
      children,
      childrenContainerStyle,
      padding,
      renderCap,
      renderInner,
      dashedBackground,
      dashedTint
    } = this.props;

    const maxWidthCircle = backgroundWidth ? Math.max(width, backgroundWidth) : width;
    const sizeWithPadding = size / 2 + padding / 2;
    const radius = size / 2 - maxWidthCircle / 2 - padding / 2;

    const currentFillAngle = (arcSweepAngle * this.clampFill(fill)) / 100;
    
    const innerPath = this.circleInnerPath(
      sizeWithPadding,
      sizeWithPadding,
      radius,
      tintTransparency ? 0 : currentFillAngle,
      arcSweepAngle
    );

    const backgroundPath = this.circlePath(
      sizeWithPadding,
      sizeWithPadding,
      radius,
      tintTransparency ? 0 : currentFillAngle,
      arcSweepAngle
    );
    const circlePath = this.circlePath(
      sizeWithPadding,
      sizeWithPadding,
      radius,
      0,
      currentFillAngle
    );
    const coordinate = this.polarToCartesian(
      sizeWithPadding,
      sizeWithPadding,
      radius,
      currentFillAngle
    );
    const cap = this.props.renderCap ? this.props.renderCap({ center: coordinate }) : null;
    const inner = this.props.renderInner ? this.props.renderInner() : null;

    const offset = size - maxWidthCircle * 2;

    const  c = {
      position: 'absolute',
      left: maxWidthCircle + padding / 2,
      top: maxWidthCircle + padding / 2,
      width: offset,
      height: offset,
      borderRadius: offset / 2,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    };

    const localChildrenContainerStyle = {
      ...c,
      ...childrenContainerStyle,
    };

    const strokeDasharrayTint = dashedTint.gap > 0 ?
      Object.values(dashedTint)
      .map(value => parseInt(value))
      : null;

    const strokeDasharrayBackground = dashedBackground.gap > 0 ?
      Object.values(dashedBackground)
      .map(value => parseInt(value))
      : null;
    //
    return (
      <View style={style}>
        <Svg width={size + padding} height={size + padding}>
          <G rotation={rotation} originX={(size + padding) / 2} originY={(size + padding) / 2}>
            {backgroundColor && (
              <>
              <Path
                d={backgroundPath}
                stroke={backgroundColor}
                strokeWidth={backgroundWidth || width}
                strokeLinecap={lineCap}
                strokeDasharray={strokeDasharrayBackground}
                fill="transparent"
                
                />
              <Path
                id="bgPath"
                d={innerPath}
                stroke="transparent"
                fill="transparent"
              />
              
              </>
            )}
            {fill > 0 && (
              <Path
                id="fillPath"
                d={circlePath}
                stroke={tintColor}
                strokeWidth={width}
                strokeLinecap={fillLineCap}
                strokeDasharray={strokeDasharrayTint}
                fill="transparent"
              />
            )}
            {cap}
            {inner}
          </G>
        </Svg>
        {children && <View style={localChildrenContainerStyle}>{children(fill)}</View>}
      </View>
    );
  }
}


CircularProgress.defaultProps = {
  tintColor: 'black',
  tintTransparency: true,
  rotation: 90,
  lineCap: 'butt',
  arcSweepAngle: 360,
  padding: 0,
  dashedBackground: { width: 0, gap: 0 },
  dashedTint: { width: 0, gap: 0 },
};
