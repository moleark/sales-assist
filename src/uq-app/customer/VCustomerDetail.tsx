import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { VPage, Page, tv, LMR, ComponentProp, Prop, PropGrid, FA, List, EasyDate, nav, EasyTime } from "tonva-react";
import { CCustomer } from "./CCustomer";
import { setting, GLOABLE } from "uq-app/appConfig";

const potentialText: { [v: number]: string } = {
    0: "小于10万",
    1: "10万-30万",
    2: "大于30万"
};

const genderText: { [v: number]: string } = {
    0: "女",
    1: "男"
};

export class VCustomerDetail extends VPage<CCustomer> {

    @observable private myCustomer: any;

    async open(param: any) {
        this.myCustomer = param;
        this.openPage(this.page, param);
    }

    private renderTask = (task: any, index: number) => {
        // let showDetail = () => this.controller.cApp.cSalesTask.showTaskDetailEdit(task);
        let { description, deadline, result } = task;
        let right = (
            <div className="text-right">
                <div className="text-muted small">
                    {<EasyDate date={deadline} />}{" "}
                </div>
                <div className="text-muted small">
                    {result ? "已完结" : "待处理"}{" "}
                </div>
            </div>
        );
        return (
            <div className="d-block py-2 px-3">
                <LMR
                    left={<strong>{description}</strong>}
                    right={right}
                ></LMR>
            </div>
        );
    };

    private renderPost = (item: any, index: number) => {
        let { user, cApp } = this.controller;
        let { cPost } = cApp;
        let { showPostDetail } = cPost
        if (!user) return;
        let { image, caption, publishdate, hits, sumHits, emphasis } = item;
        let showImport = emphasis === 1 ?
            <FA className="text-danger ml-3 " name="star" /> : null
        return (
            <div className="pl-2 pl-sm-3 pr-2 pr-sm-3 pt-2 pb-3 d-flex" >
                <div className="mr-3 w-3c w-min-3c h-3c h-min-3c">
                    {tv(
                        image,
                        values => <div className="w-100 h-100 bg-center-img h-max-6c border rounded"
                            style={{ backgroundImage: 'url(' + values.path + ')' }}></div>,
                        undefined,
                        () => (
                            <div className="d-flex align-items-center h-100 justify-content-center bg-light border rounded">
                                <FA className="text-info" name="camera" size="lg" />
                            </div>
                        )
                    )}
                </div>
                <div className="d-flex flex-column w-100 cursor-pointer" onClick={() => showPostDetail(item.post)}>
                    <div className="mb-2"><small  >{caption}</small>  </div>
                    <div className="small d-flex justify-content-between mb-2" >
                        <div className="">
                            <EasyTime date={publishdate} />
                            {showImport}
                        </div>
                        <div className="author">
                            {sumHits && <>阅读<b>{sumHits}</b>次 </>}
                            {hits > 0 && <>周<b>{hits}</b>次</>}
                        </div>
                    </div>
                </div>
                <div className="small cursor-pointer text-primary text-right w-6c pt-3 ml-1 w-3c w-min-3c h-3c h-min-3c"
                    // onClick={() => showCustomer("", item)}
                    onClick={() => this.share(item)} >
                    <button className="btn btn-outline-info  btn-sm">分享</button>
                </div>
            </div>
        );
        // let { caption } = item;
        // let right = <div className="text-primary">分享</div>;
        // return (
        //     <LMR
        //         className="px-3 my-3 cursor-pointer small"
        //         right={right}
        //         onClick={() => this.share(item)}
        //     >
        //         <div>{caption}</div>
        //     </LMR>
        // );
    };

    private share = async (post: any) => {
        await this.controller.cApp.cPost.addMyCustomerPost(
            post,
            this.myCustomer.id
        );
        let { caption, image, id, discription } = post;
        if (navigator.userAgent.indexOf("Html5Plus") > -1) {
            // @ts-ignore  屏蔽错误
            window.plusShare(
                {
                    title: caption, //应用名字
                    content: discription,
                    href: GLOABLE.posturl + "/" + id + "?sales=" + nav.user.id, //分享出去后，点击跳转地址
                    //pictures: ["https://agent.jkchemical.com/logonew.png"],//分享的图片
                    thumbs: [image.obj] //分享缩略图
                },
                function (result: any) {
                    //分享回调
                }
            );
        }
    };

    private renderTitle = (
        title: string,
        editIcon: string,
        editAction: any,
        otherIcon: string,
        otherAction: any
    ) => {
        let iconeiditname = "iconfont " + editIcon + " text-primary";
        let iconeqitaname = "iconfont " + otherIcon + " text-primary ml-3";
        return (
            <div className="px-3 py-2 strong d-flex justify-content-between mt-3 bg-white">
                <div>
                    <strong className="text-primary">{title}</strong>
                </div>
                <div>
                    {editIcon === "" ? (
                        undefined
                    ) : (
                        <span
                            className={iconeiditname}
                            style={{ fontSize: "18px" }}
                            onClick={editAction}
                        ></span>
                    )}
                    {otherIcon === "" ? (
                        undefined
                    ) : (
                        <span
                            className={iconeqitaname}
                            style={{ fontSize: "18px" }}
                            onClick={otherAction}
                        ></span>
                    )}
                </div>
            </div>
        );
    };

    private renderOrder = (model: any, index: number) => {
        let { order, orderNo, date } = model;
        let { openOrderDetail } = this.controller.cApp.cOrder;
        return (
            <div className="d-block py-2 px-3">
                <LMR
                    onClick={() => openOrderDetail(order, 'customerSelf')}
                    left={<strong>{orderNo}</strong>}
                    right={
                        <div className="text-muted small">
                            <EasyDate date={date} />
                        </div>
                    }
                ></LMR>
            </div>
        );
    };

    private geneCustomerPropertyComponent(name: string, showName: string, value: any) {
        return {
            type: "component",
            name: name,
            component: (
                <LMR
                    className="w-100 py-2"
                    left={<div>{showName}</div>}
                    right={<div className="text-right">{value}</div>}
                ></LMR>
            )
        } as ComponentProp;
    }

    private page = observer((param: any) => {
        let { id: customerid, unit, name, salutation, telephone, gender,
            email, wechat, teacher, addressString, potential, research, department, officePost, mobile, IsBinded } = param;

        let rows: Prop[] = [];
        if (unit)
            rows.push(this.geneCustomerPropertyComponent("customer", "单位", <>{tv(unit)}</>));
        rows.push(this.geneCustomerPropertyComponent("name", "姓名", name));
        if (salutation)
            rows.push(this.geneCustomerPropertyComponent("salutation", "称谓", salutation));
        if (gender)
            rows.push(this.geneCustomerPropertyComponent("salutation", "性别", genderText[gender]));
        if (mobile) {
            let telephoneShow = <div>
                <a className="text-default" href={"tel:" + mobile} style={{ textDecorationLine: "none" }}  >
                    <FA name="phone" className="text-success px-1" />
                    {mobile}
                </a>
            </div>
            rows.push(this.geneCustomerPropertyComponent("mobile", "手机号", telephoneShow));
        }
        if (telephone)
            rows.push(this.geneCustomerPropertyComponent("telephone", "固话", telephone));
        if (email)
            rows.push(this.geneCustomerPropertyComponent("email", "Email", email));
        if (wechat)
            rows.push(this.geneCustomerPropertyComponent("wechat", "微信", wechat));
        if (teacher)
            rows.push(this.geneCustomerPropertyComponent("teacher", "老师", teacher));
        if (addressString)
            rows.push(this.geneCustomerPropertyComponent("addressString", "地址", addressString));
        if (potential)
            rows.push(this.geneCustomerPropertyComponent("potential", "潜力值", potentialText[potential]));
        if (research)
            rows.push(this.geneCustomerPropertyComponent("research", "研究方向", <>{tv(research.research, v => v.name)}</>));
        if (department)
            rows.push(this.geneCustomerPropertyComponent("research", "部门", <>{tv(department.department, v => v.name)}</>));
        if (officePost)
            rows.push(this.geneCustomerPropertyComponent("research", "职位", <>{tv(officePost.officePost, v => v.name)}</>));
        rows.push(this.geneCustomerPropertyComponent("bingding", "绑定状态", (IsBinded === 1 ? "已绑定" : "未绑定")));

        let { showCustomerEdit, cApp, activetasks, customerorders, pagePost, vipCardForWebUser,
            showCreateVIPCardPage, showVIPCardDiscount, isBinded, toRelationShopId, renderOrderDraftRule } = this.controller;
        let { onSelectProduct } = cApp.cProduct;
        let { name: customerName, webuser } = this.myCustomer;
        let header: any = <span>{customerName}</span>;
        let editCustomerButton = (
            <div className="mt-2">
                <span
                    className="iconfont icon-bianji mx-3 "
                    onClick={() => showCustomerEdit(this.myCustomer)}
                ></span>
            </div>
        );

        // VIP卡
        let vipCardUI: any, vipCardContent: any;
        if (setting.sales.isInner) {
            if (IsBinded === 1) {
                if (!webuser) {
                    vipCardContent = "该用户尚未注册，请推动注册";
                }
                else {
                    if (!vipCardForWebUser) {
                        vipCardContent = <span className="small text-muted">
                            该客户无VIP卡，你可以
                        <span className="text-primary cursor-pointer" onClick={() => showCreateVIPCardPage(webuser)}>去发卡</span>
                        </span>;
                    } else {
                        let { vipCard, drawed } = vipCardForWebUser;
                        let { id: vipCardId, code, validitydate } = vipCard;
                        let drawedUI = drawed ?
                            <small><i className="fa fa-check-cicle" style={{ color: "green" }}></i> 已领取</small> :
                            <small><i className="fa fa-exclamation-triangle" style={{ color: 'red' }}></i> 未领取</small>;
                        vipCardContent = <div className="cursor-point" onClick={() => showVIPCardDiscount(vipCardId)}>
                            <FA name="th-large" className="mr-1 text-warning" />{code}
                            <small className="ml-3">有效期：<EasyDate date={validitydate} /></small>
                            <div className="d-flex mt-1 justify-content-end">
                                {drawedUI}
                            </div>
                        </div>
                    }
                }

                vipCardUI = <div className="bg-white p-3 mt-3">
                    <LMR left="VIP卡"
                        right={vipCardContent}>
                    </LMR>
                </div>
            }
        }

        let orderShowTitle: any, orderShow: any;
        if (customerorders && customerorders.length > 0) {
            orderShowTitle = this.renderTitle(
                "历史订单",
                "",
                undefined,
                "",
                undefined
            );
            orderShow = (
                <List
                    before={""}
                    none="无"
                    items={customerorders}
                    item={{ render: this.renderOrder }}
                />
            );
        }

        let postShow: any, postShowTitle: any;
        if (pagePost.items && pagePost.items !== undefined && pagePost.items.length > 0) {
            postShowTitle = this.renderTitle("贴文分享", undefined, undefined, undefined, undefined);
            postShow = (
                <List
                    before={""}
                    none="无"
                    items={pagePost}
                    item={{ render: this.renderPost }}
                />
            );
        }

        let tipUi = <></>, flags: boolean;
        if (!webuser) {
            tipUi = <span className='mb-1 text-muted small align-self-end'>*该客户尚未注册,不能制单,请推动注册</span>;
            flags = true
        } else {
            if (IsBinded === 1 || IsBinded === 0) {
                flags = false;
            } else {
                tipUi = <span className='mb-1 text-muted small align-self-end'>*该客户与其他代理/销售绑定,无法制单</span>
                flags = true
            }
        }

        //关联商城ID 
        let customerShopIDShow: any, showCustomerShopId;
        if (!webuser) {
            showCustomerShopId = <span className="cursor-pointer" onClick={() => toRelationShopId(this.myCustomer)}>
                未关联 <FA name="chevron-right" className="text-primary cursor-pointer pl-2" /></span>
        } else {
            showCustomerShopId = <span className='text-muted'>已关联<i className='text-success pl-2'>{webuser.id}</i></span>
        }

        customerShopIDShow = <div className='bg-white'>
            <div className='px-3 py-2 d-flex justify-content-between mt-3'>
                <div> <strong className="text-primary">关联百灵威商城ID</strong></div>
                {showCustomerShopId}
            </div>
            <div className='py-1 d-flex justify-content-end' >
                <div className='d-flex'>
                    {tipUi}
                    <button type="button" className="btn btn-primary my-1 px-2 ml-1" disabled={flags}
                        onClick={() => onSelectProduct()}>代客下单
                    </button>
                    <span className="cursor-pointer p-2" onClick={() => renderOrderDraftRule()} >
                        <FA name="question-circle text-warning" />
                    </span>
                </div>
            </div >
        </div>;

        return (
            <Page
                header={header}
                headerClassName={setting.pageHeaderCss}
                right={editCustomerButton}
            // footer={footer}
            >
                <PropGrid
                    rows={rows}
                    values={this.myCustomer}
                    alignValue="right"
                />
                {vipCardUI}
                {customerShopIDShow}
                {orderShowTitle}
                {orderShow}
                {postShowTitle}
                {postShow}
            </Page>
        );
    });
}
