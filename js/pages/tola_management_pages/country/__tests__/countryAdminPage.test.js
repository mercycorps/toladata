import React from 'react';
import { findDuplicateLabelIndexes } from '../models'

describe("Country admin page", () => {

    it("finds dupe indexes correctly", () => {
        let testList = ["same", "same", "diff"];
        expect(findDuplicateLabelIndexes(testList)).toEqual([0,1]);
        testList = ["same", "diff", "diff2", "same"];
        expect(findDuplicateLabelIndexes(testList)).toEqual([0,3]);
        testList = ["diff", "same", "diff2", "same"];
        expect(findDuplicateLabelIndexes(testList)).toEqual([1,3]);
        testList = ["diff", "same", "same", "same"];
        expect(findDuplicateLabelIndexes(testList)).toEqual([1,2,3]);
        testList = ["same", "same", "same", "same"];
        expect(findDuplicateLabelIndexes(testList)).toEqual([0,1,2,3]);
    });

    it("prevents duplicate labels in the same disagg type from being saved", () => {
    });
    it("allows labels with same name to be saved in different disagg types", () => {
    });
    it("prevents creation of disagg types of same name in same country", () => {
    });
    it("allows creation of disagg types of same name in different countries", () => {
    });
    it("allows archiving of disaggs with duplicated types or lables", () => {
    });




});

