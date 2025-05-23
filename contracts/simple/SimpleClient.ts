/* eslint-disable */
/**
 * This file was automatically generated by @algorandfoundation/algokit-client-generator.
 * DO NOT MODIFY IT BY HAND.
 * requires: @algorandfoundation/algokit-utils: ^2
 */
import * as algokit from "@algorandfoundation/algokit-utils";
import type {
  AppCallTransactionResult,
  AppCallTransactionResultOfType,
  CoreAppCallArgs,
  RawAppCallArgs,
  AppState,
  TealTemplateParams,
  ABIAppCallArg,
} from "@algorandfoundation/algokit-utils/types/app";
import type {
  AppClientCallCoreParams,
  AppClientCompilationParams,
  AppClientDeployCoreParams,
  AppDetails,
  ApplicationClient,
} from "@algorandfoundation/algokit-utils/types/app-client";
import type { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import type {
  SendTransactionResult,
  TransactionToSign,
  SendTransactionFrom,
} from "@algorandfoundation/algokit-utils/types/transaction";
import type { ABIResult, TransactionWithSigner, modelsv2 } from "algosdk";
import {
  Algodv2,
  OnApplicationComplete,
  Transaction,
  AtomicTransactionComposer,
} from "algosdk";
export const APP_SPEC: AppSpec = {
  hints: {
    "createApplication()void": {
      call_config: {
        no_op: "CREATE",
      },
    },
    "incr(uint64)void": {
      call_config: {
        no_op: "CALL",
      },
    },
    "decr(uint64)void": {
      call_config: {
        no_op: "CALL",
      },
    },
    "add(uint256,uint256)uint256": {
      call_config: {
        no_op: "CALL",
      },
    },
    "sub(uint256,uint256)uint256": {
      call_config: {
        no_op: "CALL",
      },
    },
  },
  source: {
    approval:
      "I3ByYWdtYSB2ZXJzaW9uIDEwCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDMyCiAgICBieXRlY2Jsb2NrICJjb3VudGVyIiAweDE1MWY3Yzc1CiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYm56IG1haW5fYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjEwCiAgICAvLyBjb3VudGVyID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogImNvdW50ZXIiLCBpbml0aWFsVmFsdWU6IDAgfSk7CiAgICBieXRlY18wIC8vICJjb3VudGVyIgogICAgaW50Y18xIC8vIDAKICAgIGFwcF9nbG9iYWxfcHV0CgptYWluX2FmdGVyX2lmX2Vsc2VAMjoKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6OQogICAgLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2ltcGxlIGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuIE51bUFwcEFyZ3MKICAgIGJ6IG1haW5fYWZ0ZXJfaWZfZWxzZUAxMwogICAgcHVzaGJ5dGVzcyAweGI4NDQ3YjM2IDB4OWZhYjg2MTAgMHgyZTBjNWE0NyAweGFjOTc2ZTAyIDB4MDkxYjMyYTcgLy8gbWV0aG9kICJjcmVhdGVBcHBsaWNhdGlvbigpdm9pZCIsIG1ldGhvZCAiaW5jcih1aW50NjQpdm9pZCIsIG1ldGhvZCAiZGVjcih1aW50NjQpdm9pZCIsIG1ldGhvZCAiYWRkKHVpbnQyNTYsdWludDI1Nil1aW50MjU2IiwgbWV0aG9kICJzdWIodWludDI1Nix1aW50MjU2KXVpbnQyNTYiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBtYWluX2NyZWF0ZUFwcGxpY2F0aW9uX3JvdXRlQDUgbWFpbl9pbmNyX3JvdXRlQDYgbWFpbl9kZWNyX3JvdXRlQDcgbWFpbl9hZGRfcm91dGVAOCBtYWluX3N1Yl9yb3V0ZUA5CgptYWluX2FmdGVyX2lmX2Vsc2VAMTM6CiAgICAvLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjkKICAgIC8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZSBleHRlbmRzIENvbnRyYWN0IHsKICAgIGludGNfMSAvLyAwCiAgICByZXR1cm4KCm1haW5fc3ViX3JvdXRlQDk6CiAgICAvLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjMxCiAgICAvLyBzdWIoYTogVWludE4yNTYsIGI6IFVpbnROMjU2KTogVWludE4yNTYgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBpcyBub3QgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGFzc2VydCAvLyBjYW4gb25seSBjYWxsIHdoZW4gbm90IGNyZWF0aW5nCiAgICAvLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjkKICAgIC8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZSBleHRlbmRzIENvbnRyYWN0IHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MzEKICAgIC8vIHN1YihhOiBVaW50TjI1NiwgYjogVWludE4yNTYpOiBVaW50TjI1NiB7CiAgICBjYWxsc3ViIHN1YgogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKbWFpbl9hZGRfcm91dGVAODoKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MjcKICAgIC8vIGFkZChhOiBVaW50TjI1NiwgYjogVWludE4yNTYpOiBVaW50TjI1NiB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIG5vdCBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6OQogICAgLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2ltcGxlIGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgLy8gY29udHJhY3RzL3NpbXBsZS9zaW1wbGUuYWxnby50czoyNwogICAgLy8gYWRkKGE6IFVpbnROMjU2LCBiOiBVaW50TjI1Nik6IFVpbnROMjU2IHsKICAgIGNhbGxzdWIgYWRkCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgptYWluX2RlY3Jfcm91dGVANzoKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MjMKICAgIC8vIGRlY3IoaTogdWludDY0KTogdm9pZCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIG5vdCBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6OQogICAgLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2ltcGxlIGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgYnRvaQogICAgLy8gY29udHJhY3RzL3NpbXBsZS9zaW1wbGUuYWxnby50czoyMwogICAgLy8gZGVjcihpOiB1aW50NjQpOiB2b2lkIHsKICAgIGNhbGxzdWIgZGVjcgogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKbWFpbl9pbmNyX3JvdXRlQDY6CiAgICAvLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjE5CiAgICAvLyBpbmNyKGk6IHVpbnQ2NCk6IHZvaWQgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBpcyBub3QgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGFzc2VydCAvLyBjYW4gb25seSBjYWxsIHdoZW4gbm90IGNyZWF0aW5nCiAgICAvLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjkKICAgIC8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZSBleHRlbmRzIENvbnRyYWN0IHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGJ0b2kKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MTkKICAgIC8vIGluY3IoaTogdWludDY0KTogdm9pZCB7CiAgICBjYWxsc3ViIGluY3IKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCm1haW5fY3JlYXRlQXBwbGljYXRpb25fcm91dGVANToKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MTYKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogInJlcXVpcmUiIH0pCiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIG5vdCBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgIQogICAgYXNzZXJ0IC8vIGNhbiBvbmx5IGNhbGwgd2hlbiBjcmVhdGluZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6OlNpbXBsZS5pbmNyKGk6IHVpbnQ2NCkgLT4gdm9pZDoKaW5jcjoKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MTkKICAgIC8vIGluY3IoaTogdWludDY0KTogdm9pZCB7CiAgICBwcm90byAxIDAKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MTAKICAgIC8vIGNvdW50ZXIgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiAiY291bnRlciIsIGluaXRpYWxWYWx1ZTogMCB9KTsKICAgIGludGNfMSAvLyAwCiAgICBieXRlY18wIC8vICJjb3VudGVyIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MTMKICAgIC8vIHRoaXMuY291bnRlci52YWx1ZSA9IHRoaXMuY291bnRlci52YWx1ZSArIGk7CiAgICBmcmFtZV9kaWcgLTEKICAgICsKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MTAKICAgIC8vIGNvdW50ZXIgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiAiY291bnRlciIsIGluaXRpYWxWYWx1ZTogMCB9KTsKICAgIGJ5dGVjXzAgLy8gImNvdW50ZXIiCiAgICAvLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjEzCiAgICAvLyB0aGlzLmNvdW50ZXIudmFsdWUgPSB0aGlzLmNvdW50ZXIudmFsdWUgKyBpOwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIHJldHN1YgoKCi8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6OlNpbXBsZS5kZWNyKGk6IHVpbnQ2NCkgLT4gdm9pZDoKZGVjcjoKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MjMKICAgIC8vIGRlY3IoaTogdWludDY0KTogdm9pZCB7CiAgICBwcm90byAxIDAKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MTAKICAgIC8vIGNvdW50ZXIgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiAiY291bnRlciIsIGluaXRpYWxWYWx1ZTogMCB9KTsKICAgIGludGNfMSAvLyAwCiAgICBieXRlY18wIC8vICJjb3VudGVyIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MjQKICAgIC8vIHRoaXMuY291bnRlci52YWx1ZSA9IHRoaXMuY291bnRlci52YWx1ZSAtIGk7CiAgICBmcmFtZV9kaWcgLTEKICAgIC0KICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MTAKICAgIC8vIGNvdW50ZXIgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiAiY291bnRlciIsIGluaXRpYWxWYWx1ZTogMCB9KTsKICAgIGJ5dGVjXzAgLy8gImNvdW50ZXIiCiAgICAvLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjI0CiAgICAvLyB0aGlzLmNvdW50ZXIudmFsdWUgPSB0aGlzLmNvdW50ZXIudmFsdWUgLSBpOwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIHJldHN1YgoKCi8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6OlNpbXBsZS5hZGQoYTogYnl0ZXMsIGI6IGJ5dGVzKSAtPiBieXRlczoKYWRkOgogICAgLy8gY29udHJhY3RzL3NpbXBsZS9zaW1wbGUuYWxnby50czoyNwogICAgLy8gYWRkKGE6IFVpbnROMjU2LCBiOiBVaW50TjI1Nik6IFVpbnROMjU2IHsKICAgIHByb3RvIDIgMQogICAgLy8gY29udHJhY3RzL3NpbXBsZS9zaW1wbGUuYWxnby50czoyOAogICAgLy8gcmV0dXJuIG5ldyBVaW50TjI1NihhLm5hdGl2ZSArIGIubmF0aXZlKTsKICAgIGZyYW1lX2RpZyAtMgogICAgZnJhbWVfZGlnIC0xCiAgICBiKwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyAzMgogICAgPD0KICAgIGFzc2VydCAvLyBvdmVyZmxvdwogICAgaW50Y18yIC8vIDMyCiAgICBiemVybwogICAgYnwKICAgIHJldHN1YgoKCi8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6OlNpbXBsZS5zdWIoYTogYnl0ZXMsIGI6IGJ5dGVzKSAtPiBieXRlczoKc3ViOgogICAgLy8gY29udHJhY3RzL3NpbXBsZS9zaW1wbGUuYWxnby50czozMQogICAgLy8gc3ViKGE6IFVpbnROMjU2LCBiOiBVaW50TjI1Nik6IFVpbnROMjU2IHsKICAgIHByb3RvIDIgMQogICAgLy8gY29udHJhY3RzL3NpbXBsZS9zaW1wbGUuYWxnby50czozMgogICAgLy8gcmV0dXJuIG5ldyBVaW50TjI1NihhLm5hdGl2ZSAtIGIubmF0aXZlKTsKICAgIGZyYW1lX2RpZyAtMgogICAgZnJhbWVfZGlnIC0xCiAgICBiLQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyAzMgogICAgPD0KICAgIGFzc2VydCAvLyBvdmVyZmxvdwogICAgaW50Y18yIC8vIDMyCiAgICBiemVybwogICAgYnwKICAgIHJldHN1Ygo=",
    clear:
      "I3ByYWdtYSB2ZXJzaW9uIDEwCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjpTaW1wbGUuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBieXRlY2Jsb2NrICJjb3VudGVyIgogICAgLy8gY29udHJhY3RzL3NpbXBsZS9zaW1wbGUuYWxnby50czoxMAogICAgLy8gY291bnRlciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6ICJjb3VudGVyIiwgaW5pdGlhbFZhbHVlOiAwIH0pOwogICAgcHVzaGludCAwIC8vIDAKICAgIGJ5dGVjXzAgLy8gImNvdW50ZXIiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gY29udHJhY3RzL3NpbXBsZS9zaW1wbGUuYWxnby50czozNgogICAgLy8gdGhpcy5pbmNyZW1lbnRDb3VudGVyKDEpOwogICAgcHVzaGludCAxIC8vIDEKICAgIC8vIGNvbnRyYWN0cy9zaW1wbGUvc2ltcGxlLmFsZ28udHM6MTMKICAgIC8vIHRoaXMuY291bnRlci52YWx1ZSA9IHRoaXMuY291bnRlci52YWx1ZSArIGk7CiAgICArCiAgICAvLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjEwCiAgICAvLyBjb3VudGVyID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogImNvdW50ZXIiLCBpbml0aWFsVmFsdWU6IDAgfSk7CiAgICBieXRlY18wIC8vICJjb3VudGVyIgogICAgLy8gY29udHJhY3RzL3NpbXBsZS9zaW1wbGUuYWxnby50czoxMwogICAgLy8gdGhpcy5jb3VudGVyLnZhbHVlID0gdGhpcy5jb3VudGVyLnZhbHVlICsgaTsKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBjb250cmFjdHMvc2ltcGxlL3NpbXBsZS5hbGdvLnRzOjM3CiAgICAvLyByZXR1cm4gdHJ1ZTsKICAgIHB1c2hpbnQgMSAvLyAxCiAgICByZXR1cm4K",
  },
  state: {
    global: {
      num_byte_slices: 0,
      num_uints: 1,
    },
    local: {
      num_byte_slices: 0,
      num_uints: 0,
    },
  },
  schema: {
    global: {
      declared: {
        counter: {
          type: "uint64",
          key: "counter",
        },
      },
      reserved: {},
    },
    local: {
      declared: {},
      reserved: {},
    },
  },
  contract: {
    name: "Simple",
    methods: [
      {
        name: "createApplication",
        args: [],
        readonly: false,
        returns: {
          type: "void",
        },
      },
      {
        name: "incr",
        args: [
          {
            type: "uint64",
            name: "i",
          },
        ],
        readonly: false,
        returns: {
          type: "void",
        },
      },
      {
        name: "decr",
        args: [
          {
            type: "uint64",
            name: "i",
          },
        ],
        readonly: false,
        returns: {
          type: "void",
        },
      },
      {
        name: "add",
        args: [
          {
            type: "uint256",
            name: "a",
          },
          {
            type: "uint256",
            name: "b",
          },
        ],
        readonly: false,
        returns: {
          type: "uint256",
        },
      },
      {
        name: "sub",
        args: [
          {
            type: "uint256",
            name: "a",
          },
          {
            type: "uint256",
            name: "b",
          },
        ],
        readonly: false,
        returns: {
          type: "uint256",
        },
      },
    ],
    networks: {},
  },
  bare_call_config: {},
};

/**
 * Defines an onCompletionAction of 'no_op'
 */
export type OnCompleteNoOp = {
  onCompleteAction?: "no_op" | OnApplicationComplete.NoOpOC;
};
/**
 * Defines an onCompletionAction of 'opt_in'
 */
export type OnCompleteOptIn = {
  onCompleteAction: "opt_in" | OnApplicationComplete.OptInOC;
};
/**
 * Defines an onCompletionAction of 'close_out'
 */
export type OnCompleteCloseOut = {
  onCompleteAction: "close_out" | OnApplicationComplete.CloseOutOC;
};
/**
 * Defines an onCompletionAction of 'delete_application'
 */
export type OnCompleteDelApp = {
  onCompleteAction:
    | "delete_application"
    | OnApplicationComplete.DeleteApplicationOC;
};
/**
 * Defines an onCompletionAction of 'update_application'
 */
export type OnCompleteUpdApp = {
  onCompleteAction:
    | "update_application"
    | OnApplicationComplete.UpdateApplicationOC;
};
/**
 * A state record containing a single unsigned integer
 */
export type IntegerState = {
  /**
   * Gets the state value as a BigInt
   */
  asBigInt(): bigint;
  /**
   * Gets the state value as a number.
   */
  asNumber(): number;
};
/**
 * A state record containing binary data
 */
export type BinaryState = {
  /**
   * Gets the state value as a Uint8Array
   */
  asByteArray(): Uint8Array;
  /**
   * Gets the state value as a string
   */
  asString(): string;
};

/**
 * Defines the types of available calls and state of the Simple smart contract.
 */
export type Simple = {
  /**
   * Maps method signatures / names to their argument and return types.
   */
  methods: Record<
    "createApplication()void" | "createApplication",
    {
      argsObj: {};
      argsTuple: [];
      returns: void;
    }
  > &
    Record<
      "incr(uint64)void" | "incr",
      {
        argsObj: {
          i: bigint | number;
        };
        argsTuple: [i: bigint | number];
        returns: void;
      }
    > &
    Record<
      "decr(uint64)void" | "decr",
      {
        argsObj: {
          i: bigint | number;
        };
        argsTuple: [i: bigint | number];
        returns: void;
      }
    > &
    Record<
      "add(uint256,uint256)uint256" | "add",
      {
        argsObj: {
          a: bigint | number;
          b: bigint | number;
        };
        argsTuple: [a: bigint | number, b: bigint | number];
        returns: bigint;
      }
    > &
    Record<
      "sub(uint256,uint256)uint256" | "sub",
      {
        argsObj: {
          a: bigint | number;
          b: bigint | number;
        };
        argsTuple: [a: bigint | number, b: bigint | number];
        returns: bigint;
      }
    >;
  /**
   * Defines the shape of the global and local state of the application.
   */
  state: {
    global: {
      counter?: IntegerState;
    };
  };
};
/**
 * Defines the possible abi call signatures
 */
export type SimpleSig = keyof Simple["methods"];
/**
 * Defines an object containing all relevant parameters for a single call to the contract. Where TSignature is undefined, a bare call is made
 */
export type TypedCallParams<TSignature extends SimpleSig | undefined> = {
  method: TSignature;
  methodArgs: TSignature extends undefined
    ? undefined
    : Array<ABIAppCallArg | undefined>;
} & AppClientCallCoreParams &
  CoreAppCallArgs;
/**
 * Defines the arguments required for a bare call
 */
export type BareCallArgs = Omit<RawAppCallArgs, keyof CoreAppCallArgs>;
/**
 * Maps a method signature from the Simple smart contract to the method's arguments in either tuple of struct form
 */
export type MethodArgs<TSignature extends SimpleSig> =
  Simple["methods"][TSignature]["argsObj" | "argsTuple"];
/**
 * Maps a method signature from the Simple smart contract to the method's return type
 */
export type MethodReturn<TSignature extends SimpleSig> =
  Simple["methods"][TSignature]["returns"];

/**
 * A factory for available 'create' calls
 */
export type SimpleCreateCalls = (typeof SimpleCallFactory)["create"];
/**
 * Defines supported create methods for this smart contract
 */
export type SimpleCreateCallParams =
  TypedCallParams<"createApplication()void"> & OnCompleteNoOp;
/**
 * Defines arguments required for the deploy method.
 */
export type SimpleDeployArgs = {
  deployTimeParams?: TealTemplateParams;
  /**
   * A delegate which takes a create call factory and returns the create call params for this smart contract
   */
  createCall?: (callFactory: SimpleCreateCalls) => SimpleCreateCallParams;
};

/**
 * Exposes methods for constructing all available smart contract calls
 */
export abstract class SimpleCallFactory {
  /**
   * Gets available create call factories
   */
  static get create() {
    return {
      /**
       * Constructs a create call for the Simple smart contract using the createApplication()void ABI method
       *
       * @param args Any args for the contract call
       * @param params Any additional parameters for the call
       * @returns A TypedCallParams object for the call
       */
      createApplication(
        args: MethodArgs<"createApplication()void">,
        params: AppClientCallCoreParams &
          CoreAppCallArgs &
          AppClientCompilationParams &
          OnCompleteNoOp = {},
      ) {
        return {
          method: "createApplication()void" as const,
          methodArgs: Array.isArray(args) ? args : [],
          ...params,
        };
      },
    };
  }

  /**
   * Constructs a no op call for the incr(uint64)void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static incr(
    args: MethodArgs<"incr(uint64)void">,
    params: AppClientCallCoreParams & CoreAppCallArgs,
  ) {
    return {
      method: "incr(uint64)void" as const,
      methodArgs: Array.isArray(args) ? args : [args.i],
      ...params,
    };
  }
  /**
   * Constructs a no op call for the decr(uint64)void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static decr(
    args: MethodArgs<"decr(uint64)void">,
    params: AppClientCallCoreParams & CoreAppCallArgs,
  ) {
    return {
      method: "decr(uint64)void" as const,
      methodArgs: Array.isArray(args) ? args : [args.i],
      ...params,
    };
  }
  /**
   * Constructs a no op call for the add(uint256,uint256)uint256 ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static add(
    args: MethodArgs<"add(uint256,uint256)uint256">,
    params: AppClientCallCoreParams & CoreAppCallArgs,
  ) {
    return {
      method: "add(uint256,uint256)uint256" as const,
      methodArgs: Array.isArray(args) ? args : [args.a, args.b],
      ...params,
    };
  }
  /**
   * Constructs a no op call for the sub(uint256,uint256)uint256 ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static sub(
    args: MethodArgs<"sub(uint256,uint256)uint256">,
    params: AppClientCallCoreParams & CoreAppCallArgs,
  ) {
    return {
      method: "sub(uint256,uint256)uint256" as const,
      methodArgs: Array.isArray(args) ? args : [args.a, args.b],
      ...params,
    };
  }
}

/**
 * A client to make calls to the Simple smart contract
 */
export class SimpleClient {
  /**
   * The underlying `ApplicationClient` for when you want to have more flexibility
   */
  public readonly appClient: ApplicationClient;

  private readonly sender: SendTransactionFrom | undefined;

  /**
   * Creates a new instance of `SimpleClient`
   *
   * @param appDetails appDetails The details to identify the app to deploy
   * @param algod An algod client instance
   */
  constructor(
    appDetails: AppDetails,
    private algod: Algodv2,
  ) {
    this.sender = appDetails.sender;
    this.appClient = algokit.getAppClient(
      {
        ...appDetails,
        app: APP_SPEC,
      },
      algod,
    );
  }

  /**
   * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
   *
   * @param result The AppCallTransactionResult to be mapped
   * @param returnValueFormatter An optional delegate to format the return value if required
   * @returns The smart contract response with an updated return value
   */
  protected mapReturnValue<TReturn>(
    result: AppCallTransactionResult,
    returnValueFormatter?: (value: any) => TReturn,
  ): AppCallTransactionResultOfType<TReturn> {
    if (result.return?.decodeError) {
      throw result.return.decodeError;
    }
    const returnValue =
      result.return?.returnValue !== undefined &&
      returnValueFormatter !== undefined
        ? returnValueFormatter(result.return.returnValue)
        : (result.return?.returnValue as TReturn | undefined);
    return { ...result, return: returnValue };
  }

  /**
   * Calls the ABI method with the matching signature using an onCompletion code of NO_OP
   *
   * @param typedCallParams An object containing the method signature, args, and any other relevant parameters
   * @param returnValueFormatter An optional delegate which when provided will be used to map non-undefined return values to the target type
   * @returns The result of the smart contract call
   */
  public async call<TSignature extends keyof Simple["methods"]>(
    typedCallParams: TypedCallParams<TSignature>,
    returnValueFormatter?: (value: any) => MethodReturn<TSignature>,
  ) {
    return this.mapReturnValue<MethodReturn<TSignature>>(
      await this.appClient.call(typedCallParams),
      returnValueFormatter,
    );
  }

  /**
   * Idempotently deploys the Simple smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  public deploy(
    params: SimpleDeployArgs & AppClientDeployCoreParams = {},
  ): ReturnType<ApplicationClient["deploy"]> {
    const createArgs = params.createCall?.(SimpleCallFactory.create);
    return this.appClient.deploy({
      ...params,
      createArgs,
      createOnCompleteAction: createArgs?.onCompleteAction,
    });
  }

  /**
   * Gets available create methods
   */
  public get create() {
    const $this = this;
    return {
      /**
       * Creates a new instance of the Simple smart contract using the createApplication()void ABI method.
       *
       * @param args The arguments for the smart contract call
       * @param params Any additional parameters for the call
       * @returns The create result
       */
      async createApplication(
        args: MethodArgs<"createApplication()void">,
        params: AppClientCallCoreParams &
          AppClientCompilationParams &
          OnCompleteNoOp = {},
      ): Promise<
        AppCallTransactionResultOfType<MethodReturn<"createApplication()void">>
      > {
        return $this.mapReturnValue(
          await $this.appClient.create(
            SimpleCallFactory.create.createApplication(args, params),
          ),
        );
      },
    };
  }

  /**
   * Makes a clear_state call to an existing instance of the Simple smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The clear_state result
   */
  public clearState(
    args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {},
  ) {
    return this.appClient.clearState(args);
  }

  /**
   * Calls the incr(uint64)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public incr(
    args: MethodArgs<"incr(uint64)void">,
    params: AppClientCallCoreParams & CoreAppCallArgs = {},
  ) {
    return this.call(SimpleCallFactory.incr(args, params));
  }

  /**
   * Calls the decr(uint64)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public decr(
    args: MethodArgs<"decr(uint64)void">,
    params: AppClientCallCoreParams & CoreAppCallArgs = {},
  ) {
    return this.call(SimpleCallFactory.decr(args, params));
  }

  /**
   * Calls the add(uint256,uint256)uint256 ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public add(
    args: MethodArgs<"add(uint256,uint256)uint256">,
    params: AppClientCallCoreParams & CoreAppCallArgs = {},
  ) {
    return this.call(SimpleCallFactory.add(args, params));
  }

  /**
   * Calls the sub(uint256,uint256)uint256 ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public sub(
    args: MethodArgs<"sub(uint256,uint256)uint256">,
    params: AppClientCallCoreParams & CoreAppCallArgs = {},
  ) {
    return this.call(SimpleCallFactory.sub(args, params));
  }

  /**
   * Extracts a binary state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns A BinaryState instance containing the state value, or undefined if the key was not found
   */
  private static getBinaryState(
    state: AppState,
    key: string,
  ): BinaryState | undefined {
    const value = state[key];
    if (!value) return undefined;
    if (!("valueRaw" in value))
      throw new Error(
        `Failed to parse state value for ${key}; received an int when expected a byte array`,
      );
    return {
      asString(): string {
        return value.value;
      },
      asByteArray(): Uint8Array {
        return value.valueRaw;
      },
    };
  }

  /**
   * Extracts a integer state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns An IntegerState instance containing the state value, or undefined if the key was not found
   */
  private static getIntegerState(
    state: AppState,
    key: string,
  ): IntegerState | undefined {
    const value = state[key];
    if (!value) return undefined;
    if ("valueRaw" in value)
      throw new Error(
        `Failed to parse state value for ${key}; received a byte array when expected a number`,
      );
    return {
      asBigInt() {
        return typeof value.value === "bigint"
          ? value.value
          : BigInt(value.value);
      },
      asNumber(): number {
        return typeof value.value === "bigint"
          ? Number(value.value)
          : value.value;
      },
    };
  }

  /**
   * Returns the smart contract's global state wrapped in a strongly typed accessor with options to format the stored value
   */
  public async getGlobalState(): Promise<Simple["state"]["global"]> {
    const state = await this.appClient.getGlobalState();
    return {
      get counter() {
        return SimpleClient.getIntegerState(state, "counter");
      },
    };
  }

  public compose(): SimpleComposer {
    const client = this;
    const atc = new AtomicTransactionComposer();
    let promiseChain: Promise<unknown> = Promise.resolve();
    const resultMappers: Array<undefined | ((x: any) => any)> = [];
    return {
      incr(
        args: MethodArgs<"incr(uint64)void">,
        params?: AppClientCallCoreParams & CoreAppCallArgs,
      ) {
        promiseChain = promiseChain.then(() =>
          client.incr(args, {
            ...params,
            sendParams: { ...params?.sendParams, skipSending: true, atc },
          }),
        );
        resultMappers.push(undefined);
        return this;
      },
      decr(
        args: MethodArgs<"decr(uint64)void">,
        params?: AppClientCallCoreParams & CoreAppCallArgs,
      ) {
        promiseChain = promiseChain.then(() =>
          client.decr(args, {
            ...params,
            sendParams: { ...params?.sendParams, skipSending: true, atc },
          }),
        );
        resultMappers.push(undefined);
        return this;
      },
      add(
        args: MethodArgs<"add(uint256,uint256)uint256">,
        params?: AppClientCallCoreParams & CoreAppCallArgs,
      ) {
        promiseChain = promiseChain.then(() =>
          client.add(args, {
            ...params,
            sendParams: { ...params?.sendParams, skipSending: true, atc },
          }),
        );
        resultMappers.push(undefined);
        return this;
      },
      sub(
        args: MethodArgs<"sub(uint256,uint256)uint256">,
        params?: AppClientCallCoreParams & CoreAppCallArgs,
      ) {
        promiseChain = promiseChain.then(() =>
          client.sub(args, {
            ...params,
            sendParams: { ...params?.sendParams, skipSending: true, atc },
          }),
        );
        resultMappers.push(undefined);
        return this;
      },
      clearState(
        args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs,
      ) {
        promiseChain = promiseChain.then(() =>
          client.clearState({
            ...args,
            sendParams: { ...args?.sendParams, skipSending: true, atc },
          }),
        );
        resultMappers.push(undefined);
        return this;
      },
      addTransaction(
        txn:
          | TransactionWithSigner
          | TransactionToSign
          | Transaction
          | Promise<SendTransactionResult>,
        defaultSender?: SendTransactionFrom,
      ) {
        promiseChain = promiseChain.then(async () =>
          atc.addTransaction(
            await algokit.getTransactionWithSigner(
              txn,
              defaultSender ?? client.sender,
            ),
          ),
        );
        return this;
      },
      async atc() {
        await promiseChain;
        return atc;
      },
      async simulate() {
        await promiseChain;
        const result = await atc.simulate(client.algod);
        return result;
      },
      async execute() {
        await promiseChain;
        const result = await algokit.sendAtomicTransactionComposer(
          { atc, sendParams: {} },
          client.algod,
        );
        return {
          ...result,
          returns: result.returns?.map((val, i) =>
            resultMappers[i] !== undefined
              ? resultMappers[i]!(val.returnValue)
              : val.returnValue,
          ),
        };
      },
    } as unknown as SimpleComposer;
  }
}
export type SimpleComposer<TReturns extends [...any[]] = []> = {
  /**
   * Calls the incr(uint64)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  incr(
    args: MethodArgs<"incr(uint64)void">,
    params?: AppClientCallCoreParams & CoreAppCallArgs,
  ): SimpleComposer<[...TReturns, MethodReturn<"incr(uint64)void">]>;

  /**
   * Calls the decr(uint64)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  decr(
    args: MethodArgs<"decr(uint64)void">,
    params?: AppClientCallCoreParams & CoreAppCallArgs,
  ): SimpleComposer<[...TReturns, MethodReturn<"decr(uint64)void">]>;

  /**
   * Calls the add(uint256,uint256)uint256 ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  add(
    args: MethodArgs<"add(uint256,uint256)uint256">,
    params?: AppClientCallCoreParams & CoreAppCallArgs,
  ): SimpleComposer<[...TReturns, MethodReturn<"add(uint256,uint256)uint256">]>;

  /**
   * Calls the sub(uint256,uint256)uint256 ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  sub(
    args: MethodArgs<"sub(uint256,uint256)uint256">,
    params?: AppClientCallCoreParams & CoreAppCallArgs,
  ): SimpleComposer<[...TReturns, MethodReturn<"sub(uint256,uint256)uint256">]>;

  /**
   * Makes a clear_state call to an existing instance of the Simple smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  clearState(
    args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs,
  ): SimpleComposer<[...TReturns, undefined]>;

  /**
   * Adds a transaction to the composer
   *
   * @param txn One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by one of algokit utils helpers (signer is obtained from the defaultSender parameter)
   * @param defaultSender The default sender to be used to obtain a signer where the object provided to the transaction parameter does not include a signer.
   */
  addTransaction(
    txn:
      | TransactionWithSigner
      | TransactionToSign
      | Transaction
      | Promise<SendTransactionResult>,
    defaultSender?: SendTransactionFrom,
  ): SimpleComposer<TReturns>;
  /**
   * Returns the underlying AtomicTransactionComposer instance
   */
  atc(): Promise<AtomicTransactionComposer>;
  /**
   * Simulates the transaction group and returns the result
   */
  simulate(): Promise<SimpleComposerSimulateResult>;
  /**
   * Executes the transaction group and returns the results
   */
  execute(): Promise<SimpleComposerResults<TReturns>>;
};
export type SimpleComposerSimulateResult = {
  methodResults: ABIResult[];
  simulateResponse: modelsv2.SimulateResponse;
};
export type SimpleComposerResults<TReturns extends [...any[]]> = {
  returns: TReturns;
  groupId: string;
  txIds: string[];
  transactions: Transaction[];
};
