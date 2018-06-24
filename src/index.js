/**
 * @class Recorder
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import vmsg from './vmsg'

import micIcon from './mic-icon-white.svg'
import wasmURL from './vmsg.wasm'

import styles from './styles.css'

const shimURL = 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js'

export default class Recorder extends Component {
  static propTypes = {
    recorderParams: PropTypes.object,
    onRecordingComplete: PropTypes.func,
    onRecordingError: PropTypes.func,
    onRecordingBegun: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    recorderParams: { },
    onRecordingComplete: () => { },
    onRecordingError: () => { },
    onRecordingBegun: () => { }
  }

  state = {
    isRecording: false
  }

  _recorder = null

  componentWillUnmount() {
    this._cleanup()
  }



  render() {
    var buttonClasses = classNames({
      'button' :  true,
      'recording' : this.state.isRecording
    });
    const {
      recorderParams,
      onRecordingComplete,
      onRecordingError,
      className,
      ...rest
    } = this.props

    return (
      <div
        className={classNames(styles.container, className)}
        {...rest}
      >
        <div
          className={buttonClasses}
          onMouseDown={this._onMouseDown}
          onMouseUp={this._onMouseUp}
        >
          <img src={micIcon} width={24} height={24} />
        </div>
      </div>
    )
  }

  _cleanup() {
    if (this._recorder) {
      this._recorder.stopRecording()
      this._recorder.close()
      delete this._recorder
    }
  }

  _onMouseUp = () => {
    if (!this.state.isRecording) {
      this.props.onRecordingBegun()
      const {
        recorderParams
      } = this.props

      this._cleanup()

      this._recorder = new vmsg.Recorder({
        wasmURL,
        shimURL,
        ...recorderParams
      })

      this._recorder.init()
        .then(() => {
          this._recorder.startRecording()
          this.setState({ isRecording: true })
        })
        .catch((err) => this.props.onRecordingError(err))
      } else {
        if (this._recorder) {
        this._recorder.stopRecording()
        .then((blob) => this.props.onRecordingComplete(blob))
        .catch((err) => this.props.onRecordingError(err))
    }

      }
  }

  _onMouseDown = () => {
  }
}
