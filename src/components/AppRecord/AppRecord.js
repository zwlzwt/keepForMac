import React, { Component } from 'react'
import $http from '../../js/HttpRequest.js'
import autobind from 'autobind-decorator'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import moment from 'moment'
import Utils from '../../js/Utils.js'

import styles from '../../sass/appRecord.scss'

@CSSModules(styles)
class AppRecord extends Component{
    constructor(props){
        super(props)
        this.state = {
            listData : []
        }
        moment.locale('zh-cn')
    }

    componentWillMount(){
        $http.getFollowTimeline().then((res) => {
            if(res.ok) {
                console.info(res)
                this.setState({
                    listData: res.data.timeline
                })
                Utils.storage.set('followTimeline', res.data.timeline)
            }
        })
    }

    render(){
        if(this.state.listData.length)
        return(
            <div className="scroll-content">
                <section styleName="art-list">
                    {this.state.listData.map((item) => {
                        let content = item.content.replace(/#.*#/g, (ment) => {
                            let link = `/hashtag/${encodeURIComponent(ment.substring(1, ment.length-1))}`
                            return (
                                `<a href=${link}>${ment}</a>`
                            )
                        }).replace(/\n/g, '<br>')

                        //if(item.type === 'normal')
                            return (
                                <article key={item._id} styleName="art-item">
                                    <div styleName="art-inner">
                                        <header styleName="art-header">
                                            <img styleName="header-avatar" src={item.author.avatar} alt=""/>
                                            <p styleName="header-username">{item.author.username} <span styleName="header-sub">{item.country} {item.city}</span></p>
                                            <span styleName="header-time">{moment(new Date()).diff(moment(item.created), 'h') < 22 ? moment(item.created).fromNow() : moment(item.created).format('YYYY/MM/DD HH:mm')}</span>
                                        </header>
                                        <div styleName="art-content">
                                            <img styleName="art-photo" src={item.photo || ''} alt=""/>
                                            <p styleName="art-txt" dangerouslySetInnerHTML={{__html: content}}></p>
                                        </div>
                                        <footer styleName="art-footer">
                                            <button styleName="footer-btn" title="加油"><span styleName="footer-sp"><i className="iconfont fz14 icon-liked"></i></span></button>
                                            <button styleName="footer-btn" title="评论"><span styleName="footer-sp"><i className="iconfont fz14 icon-comment"></i></span></button>
                                            <button styleName="footer-btn" title="分享"><span styleName="footer-sp"><i className="iconfont fz14 icon-share"></i></span></button>
                                            <div styleName="footer-inner">
                                                <span styleName="item-workout" hidden={item.type != 'normal'}><i className="iconfont fz14 icon-training"></i> 完成 {item.meta.workoutName} 第 {item.meta.count} 次</span>
                                            </div>
                                            <span className="fz12" styleName="art-liked"><i className="iconfont icon-cheer fz14"></i>{item.likes}人加油</span>
                                        </footer>
                                    </div>
                                </article>
                            )
                    })}
                </section>
            </div>
        )
    }
}

export default AppRecord