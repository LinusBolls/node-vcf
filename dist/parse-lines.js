"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _camelcase=_interopRequireDefault(require("camelcase"));var _property=_interopRequireDefault(require("./property"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function set(object,key,value){if(Array.isArray(object[key])){object[key].push(value);return}if(object[key]!=null){object[key]=[object[key],value];return}object[key]=value}function createParams(params,param){const parts=param.split("=");let k=(0,_camelcase).default(parts[0]);let value1=parts[1];if(value1==null||value1===""){value1=parts[0];k="type"}if(k==="type"){if(value1.startsWith('"')&&value1.endsWith('"')&&value1.includes(","))value1=value1.slice(1,-1);value1.toLowerCase().split(",").forEach(value=>{set(params,k,value)});return params}set(params,k,value1);return params}function parseLines(lines){const data={};const pattern=/^([^;:]+)((?:;(?:[^;:]+))*)(?:\:([\s\S]+))?$/i;for(const line of lines){const match=pattern.exec(line);if(!match)continue;const name=match[1].split(".");const property=name.pop();const group=name.pop();const value=match[3];const params=match[2]?match[2].replace(/^;|;$/g,"").split(";"):[];const propParams=params.reduce(createParams,group?{group}:{});const propName=(0,_camelcase).default(property);const propVal=(0,_property).default(propName,value,propParams);set(data,propName,propVal)}return data}var _default=parseLines;exports.default=_default
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9wYXJzZS1saW5lcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2FtZWxDYXNlIGZyb20gXCJjYW1lbGNhc2VcIjtcblxuaW1wb3J0IFByb3BlcnR5IGZyb20gXCIuL3Byb3BlcnR5XCI7XG5cbnR5cGUgdmFsID0gc3RyaW5nIHwgdHlwZW9mIFByb3BlcnR5O1xuXG5mdW5jdGlvbiBzZXQob2JqZWN0OiB7IFtrZXk6IHN0cmluZ106IHZhbCB8IHZhbFtdIH0sIGtleTogc3RyaW5nLCB2YWx1ZTogdmFsKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG9iamVjdFtrZXldKSkge1xuICAgIChvYmplY3Rba2V5XSBhcyB2YWxbXSkucHVzaCh2YWx1ZSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChvYmplY3Rba2V5XSAhPSBudWxsKSB7XG4gICAgb2JqZWN0W2tleV0gPSBbb2JqZWN0W2tleV0gYXMgdmFsLCB2YWx1ZV07XG4gICAgcmV0dXJuO1xuICB9XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhcmFtcyhwYXJhbXMsIHBhcmFtKSB7XG4gIGNvbnN0IHBhcnRzID0gcGFyYW0uc3BsaXQoXCI9XCIpO1xuICBsZXQgayA9IGNhbWVsQ2FzZShwYXJ0c1swXSk7XG4gIGxldCB2YWx1ZSA9IHBhcnRzWzFdO1xuXG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSBcIlwiKSB7XG4gICAgdmFsdWUgPSBwYXJ0c1swXTtcbiAgICBrID0gXCJ0eXBlXCI7XG4gIH1cbiAgaWYgKGsgPT09IFwidHlwZVwiKSB7XG4gICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoJ1wiJykgJiYgdmFsdWUuZW5kc1dpdGgoJ1wiJykgJiYgdmFsdWUuaW5jbHVkZXMoXCIsXCIpKVxuICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSk7XG5cbiAgICB2YWx1ZVxuICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgIC5zcGxpdChcIixcIilcbiAgICAgIC5mb3JFYWNoKCh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHNldChwYXJhbXMsIGssIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cbiAgc2V0KHBhcmFtcywgaywgdmFsdWUpO1xuXG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTGluZXMobGluZXM6IGFueVtdKSB7XG4gIGNvbnN0IGRhdGEgPSB7fTtcblxuICAvLyBOT1RFOiBMaW5lIGZvcm1hdDpcbiAgLy8gIFBST1BFUlRZWztQQVJBTUVURVJbPVZBTFVFXV06QXR0cmlidXRlWztBdHRyaWJ1dGVdXG5cbiAgY29uc3QgcGF0dGVybiA9IC9eKFteOzpdKykoKD86Oyg/OlteOzpdKykpKikoPzpcXDooW1xcc1xcU10rKSk/JC9pO1xuXG4gIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xuICAgIGNvbnN0IG1hdGNoID0gcGF0dGVybi5leGVjKGxpbmUpO1xuXG4gICAgaWYgKCFtYXRjaCkgY29udGludWU7XG5cbiAgICBjb25zdCBuYW1lID0gbWF0Y2hbMV0uc3BsaXQoXCIuXCIpO1xuICAgIGNvbnN0IHByb3BlcnR5ID0gbmFtZS5wb3AoKTtcbiAgICBjb25zdCBncm91cCA9IG5hbWUucG9wKCk7XG4gICAgY29uc3QgdmFsdWUgPSBtYXRjaFszXTtcbiAgICBjb25zdCBwYXJhbXMgPSBtYXRjaFsyXSA/IG1hdGNoWzJdLnJlcGxhY2UoL147fDskL2csIFwiXCIpLnNwbGl0KFwiO1wiKSA6IFtdO1xuXG4gICAgY29uc3QgcHJvcFBhcmFtcyA9IHBhcmFtcy5yZWR1Y2UoY3JlYXRlUGFyYW1zLCBncm91cCA/IHsgZ3JvdXAgfSA6IHt9KTtcbiAgICBjb25zdCBwcm9wTmFtZSA9IGNhbWVsQ2FzZShwcm9wZXJ0eSk7XG4gICAgY29uc3QgcHJvcFZhbCA9IFByb3BlcnR5KHByb3BOYW1lLCB2YWx1ZSwgcHJvcFBhcmFtcyk7XG5cbiAgICBzZXQoZGF0YSwgcHJvcE5hbWUsIHByb3BWYWwpO1xuICB9XG4gIHJldHVybiBkYXRhO1xufVxuZXhwb3J0IGRlZmF1bHQgcGFyc2VMaW5lcztcbiJdLCJuYW1lcyI6WyJzZXQiLCJvYmplY3QiLCJrZXkiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsInB1c2giLCJjcmVhdGVQYXJhbXMiLCJwYXJhbXMiLCJwYXJhbSIsInBhcnRzIiwic3BsaXQiLCJrIiwiY2FtZWxDYXNlIiwic3RhcnRzV2l0aCIsImVuZHNXaXRoIiwiaW5jbHVkZXMiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiZm9yRWFjaCIsInBhcnNlTGluZXMiLCJsaW5lcyIsImRhdGEiLCJwYXR0ZXJuIiwibGluZSIsIm1hdGNoIiwiZXhlYyIsIm5hbWUiLCJwcm9wZXJ0eSIsInBvcCIsImdyb3VwIiwicmVwbGFjZSIsInByb3BQYXJhbXMiLCJyZWR1Y2UiLCJwcm9wTmFtZSIsInByb3BWYWwiLCJQcm9wZXJ0eSJdLCJtYXBwaW5ncyI6IkFBQUEsNEZBQXNCLEtBQUEsVUFBVyxnQ0FBWCxXQUFXLEVBQUEsQUFFWixLQUFBLFNBQVksZ0NBQVosWUFBWSxFQUFBLG1GQUlqQyxTQUFTQSxHQUFHLENBQUNDLE1BQXNDLENBQUVDLEdBQVcsQ0FBRUMsS0FBVSxDQUFFLENBQzVFLEdBQUlDLEtBQUssQ0FBQ0MsT0FBTyxDQUFDSixNQUFNLENBQUNDLEdBQUcsQ0FBQyxDQUFDLENBQUUsQ0FDOUIsQUFBQ0QsTUFBTSxDQUFDQyxHQUFHLENBQUMsQ0FBV0ksSUFBSSxDQUFDSCxLQUFLLENBQUMsQUFDbEMsT0FBTyxDQUNSLEFBQ0QsR0FBSUYsTUFBTSxDQUFDQyxHQUFHLENBQUMsRUFBSSxJQUFJLENBQUUsQ0FDdkJELE1BQU0sQ0FBQ0MsR0FBRyxDQUFDLENBQUcsQ0FBQ0QsTUFBTSxDQUFDQyxHQUFHLENBQUMsQ0FBU0MsS0FBSyxDQUFDLEFBQ3pDLE9BQU8sQ0FDUixBQUNERixNQUFNLENBQUNDLEdBQUcsQ0FBQyxDQUFHQyxLQUFLLENBQ3BCLEFBRUQsU0FB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