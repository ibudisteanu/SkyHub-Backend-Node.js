/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

import UniqueVisitorsHelper from '../visitors/helpers/UniqueVisitors.helper';
import HashList from 'DB/Redis/lists/HashList.helper'
import VoteType from 'REST/voting/models/VoteType'

import VotingInfoHashList from 'REST/voting/helpers/VotingInfo.hashlist.js'
import MaterializedParentsHelper from 'DB/common/materialized-parents/MaterializedParents.helper';

class StatisticsHelper{

    //sortedList
    constructor(){
        this.hashList = new HashList("Statistics:Information");
    }

    //          UNIQUE VISITORS

    async addUniqueVisitorCounter(parentId, visitorIP){
        let res = await UniqueVisitorsHelper.addUniqueVisitor(parentId, visitorIP);
        await this.addPageViewCounter(parentId);

        return res;
    }

    async getUniqueVisitorsCounter(parentId){
        let rez = await UniqueVisitorsHelper.countUniqueVisitors(parentId);
        return (rez !== null ? rez : 0);
    }

    //          PAGE VIEWS

    async addPageViewCounter(parentId){
        return await this.hashList.incrementBy(parentId, 'PageViews', +1);
    }

    async setManuallyPageViewsCounter(parentId, value){
        return await this.hashList.setHash(parentId, 'PageViews', value);
    }

    async getPageViewsCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'PageViews');
        return (rez !== null ? rez : 0);
    }


    //          TOTAL REPLIES

    async updateTotalRepliesCounter(parentId, value){

        if (typeof value === 'undefined') value = +1;

        return await this.hashList.incrementBy(parentId, 'TotalReplies', value);
    }

    async getTotalRepliesCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'TotalReplies');
        return (rez !== null ? rez : 0);
    }

    //          REPLIES

    async updateRepliesCounter(parentId, value){

        if (typeof value === 'undefined') value = +1;

        return await this.hashList.incrementBy(parentId, 'Replies', value);
    }

    async getRepliesCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'Replies');
        return (rez !== null ? rez : 0);
    }

    //          VOTES

    async getVoteUpsCounter(parentId){
        // it is using the VotesHelper
        let rez = await VotingInfoHashList.getVoteUpsValue(parentId);
        return (rez !== null ? rez : 0);
    }

    async getVoteDownsCounter(parentId){
        // it is using the VotesHelper
        let rez = await VotingInfoHashList.getVoteDownsValue(parentId);
        return (rez !== null ? rez : 0);
    }

    //          TOTAL VOTES

    //                  UPS
    async updateTotalVoteUpsCounter (parentId, value){

        if (typeof value === 'undefined') value = 0;

        if (value !== 0)
            return await this.hashList.incrementBy(parentId, 'VoteUps', value);

        return false;
    }

    async getTotalVoteUpsCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'VoteUps');
        return (rez !== null ? rez : 0);
    }

    //                  DOWNS
    async updateTotalVoteDownsCounter (parentId, value){

        if (typeof value === 'undefined') value = 0;

        if (value !== 0)
            return await this.hashList.incrementBy(parentId, 'VoteDowns', value);

        return false;
    }

    async getTotalVoteDownsCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'VoteDowns');
        return (rez !== null ? rez : 0);
    }

    //          TOTAL TOPICS

    async updateTotalTopicsCounter (parentId, value){

        if (typeof value === 'undefined') value = +1;

        return await this.hashList.incrementBy(parentId, 'Topics', value);

        return false;
    }

    async getTotalTopicsCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'Topics');
        return (rez !== null ? rez : 0);
    }

    //          TOTAL FORUMS

    async updateTotalForumsCounter (parentId, value){

        if (typeof value === 'undefined') value = +1;

        return await this.hashList.incrementBy(parentId, 'Forums', value);
    }

    async getTotalForumsCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'Forums');
        return (rez !== null ? rez : 0);
    }



    async keepParentsStatisticsUpdated(id, parents, enableNullParent, callback, value, bDelete){

        if (typeof parents === "string") parents = [parents];
        if (value === 0) return false; // nothing to change...

        if (id !== ''){
            await this.keepElementSortedList(id, parents, bDelete);
        }

        let arrParentsUnique = MaterializedParentsHelper.getMaterializedParentsFromStringList(parents, [''] );

        for (let i = 0, len = arrParentsUnique.length; i < len; i++) {
            let parent = arrParentsUnique[i];

            if (((enableNullParent) && (parent === '')) || (parent !== '')) {

                await callback(parent, value);

                let grandParents = [];
                for (let j = 0, len = arrParentsUnique.length; j < len; j++) {
                    grandParents.push(arrParentsUnique[j]);
                }
                await this.keepElementSortedList(id, grandParents);

            }
        }

    }

    async keepElementSortedList(id, parents, bDelete){
        let idData = MaterializedParentsHelper.extractDataFromIds(id);

        // console.log('--------------------------');console.log('--------------------------');console.log('--------------------------');console.log('--------------------------');
        // console.log(id, idData, parents);
        // console.log('--------------------------');console.log('--------------------------');console.log('--------------------------');console.log('--------------------------');

        if (idData === null) return null;



        switch (idData.objectType) {
            case 'user':
                return ''; //to do for users too

            case 'forum':
                let ForumsSorter = require ('../../forums/forums/models/ForumsSorter.js').default;
                await ForumsSorter.calculateKeepSortedList(id, parents, bDelete);

                if (bDelete) await ForumsSorter.destroySorterInDB(id);

                return true;
            case 'reply':
                let RepliesSorter = require ('../../forums/replies/models/RepliesSorter.js').default;
                await RepliesSorter.calculateKeepSortedList(id, parents, bDelete);

                if (bDelete) await ForumsSorter.destroySorterInDB(id);

                return true;

            case 'topic':
                let TopicsSorter = require ('../../forums/topics/models/TopicsSorter.js').default;
                await TopicsSorter.calculateKeepSortedList(id, parents, bDelete);

                if (bDelete) await ForumsSorter.destroySorterInDB(id);

                return true;

        }
    }

};

export default new StatisticsHelper();