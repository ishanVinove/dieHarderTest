// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

library console {
    event LogUint(string message, uint256 value);
    event LogInt(string message, int256 value);
    event LogString(string message, string value);
    event LogBool(string message, bool value);
    event LogAddress(string message, address value);

    function log(string memory message, uint256 value) public {
        emit LogUint(message, value);
    }

    function log(string memory message, int256 value) public {
        emit LogInt(message, value);
    }

    function log(string memory message, string memory value) public {
        emit LogString(message, value);
    }

    function log(string memory message, bool value) public {
        emit LogBool(message, value);
    }

    function log(string memory message, address value) public {
        emit LogAddress(message, value);
    }
}
