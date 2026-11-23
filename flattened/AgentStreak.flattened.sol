// Sources flattened with hardhat v2.26.3 https://hardhat.org

// SPDX-License-Identifier: MIT

// File contracts/AgentStreak.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;

/// @title AgentStreak — Agent ID-gated daily check-in
/// @notice A minimal, fee-free daily check-in contract for holders of a
///         Binance Agent ID (SPACE ID Agent ID, ERC-721, non-transferable).
///         Only addresses holding at least one Agent ID can check in, at
///         most once per UTC day. Check-ins earn points/streaks only — they
///         have NO monetary value and there is no token, no fee, no custody
///         and no yield of any kind.
///
///         SECURITY / ADMIN POWERS: this contract has NO owner and NO admin
///         functions at all. There is no pause, no mint, no freeze, no tax,
///         no withdraw, no upgrade and no way for anyone (including the
///         deployer) to change its behaviour or move any funds. It cannot
///         hold user funds: checkIn() is not payable and the contract never
///         receives BNB. The Agent ID contract address is immutable, set
///         once in the constructor.
///
///         Agent ID gating: the contract calls balanceOf(user) on the Agent
///         ID contract (0x60b9262456de011f7d15a54cdd8c48baaa8b022f on BNB
///         Chain mainnet). A return value greater than 0 means the caller
///         holds an Agent ID. This contract does NOT look up wallets by
///         Agent ID name and never stores or resolves names.
interface IAgentID {
    function balanceOf(address owner) external view returns (uint256);
}

contract AgentStreak {
    /// @notice The Agent ID contract used for gating (immutable).
    IAgentID public immutable agentId;

    /// @notice Total number of check-ins ever recorded.
    uint256 public totalCheckins;

    /// @notice Current consecutive-day streak per address.
    mapping(address => uint256) public currentStreak;
    /// @notice Longest streak ever reached per address.
    mapping(address => uint256) public longestStreak;
    /// @notice Total check-ins per address.
    mapping(address => uint256) public totalCheckinsOf;
    /// @notice UTC day number (block.timestamp / 1 days) of the last check-in.
    mapping(address => uint256) public lastCheckinDay;

    /// @notice Emitted on every successful check-in.
    event CheckIn(address indexed user, uint256 indexed day, uint256 streak, uint256 total);

    /// @notice Thrown when the caller holds no Agent ID.
    error NotAgentIdHolder();
    /// @notice Thrown when the caller already checked in today (UTC).
    error AlreadyCheckedInToday();

    /// @param agentIdContract Address of the Agent ID ERC-721 contract.
    constructor(address agentIdContract) {
        require(agentIdContract != address(0), "AgentStreak: zero Agent ID address");
        agentId = IAgentID(agentIdContract);
    }

    /// @notice Current UTC day number (days since Unix epoch, UTC).
    function today() public view returns (uint256) {
        return block.timestamp / 1 days;
    }

    /// @notice Check in for today (UTC). Requires holding an Agent ID.
    ///         At most once per UTC day. A missed day resets the streak to 1.
    function checkIn() external {
        if (agentId.balanceOf(msg.sender) == 0) revert NotAgentIdHolder();

        uint256 day = today();
        uint256 last = lastCheckinDay[msg.sender];
        if (last == day) revert AlreadyCheckedInToday();

        uint256 streak = (last == day - 1) ? currentStreak[msg.sender] + 1 : 1;
        currentStreak[msg.sender] = streak;
        if (streak > longestStreak[msg.sender]) {
            longestStreak[msg.sender] = streak;
        }
        totalCheckinsOf[msg.sender] += 1;
        lastCheckinDay[msg.sender] = day;
        totalCheckins += 1;

        emit CheckIn(msg.sender, day, streak, totalCheckinsOf[msg.sender]);
    }

    /// @notice Current streak of `user`.
    function streakOf(address user) external view returns (uint256) {
        return currentStreak[user];
    }

    /// @notice Total check-ins of `user`.
    function totalOf(address user) external view returns (uint256) {
        return totalCheckinsOf[user];
    }

    /// @notice UTC day number of `user`'s last check-in (0 if never).
    function lastDayOf(address user) external view returns (uint256) {
        return lastCheckinDay[user];
    }

    /// @notice Whether `user` has already checked in today (UTC).
    function hasCheckedInToday(address user) external view returns (bool) {
        return lastCheckinDay[user] == today();
    }
}
